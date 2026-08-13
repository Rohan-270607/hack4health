from flask import Flask, request, jsonify
from flask_cors import CORS

import io
import numpy as np
import pandas as pd
import joblib
import librosa
import onnxruntime as ort

from PIL import Image
from huggingface_hub import hf_hub_download


# ============================================================
# FLASK SETUP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# CONFIGURATION
# ============================================================

FACE_EMOTIONS = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

AUDIO_MODEL_PATH = r"models\audio_emotion_model.pkl"
AUDIO_FEATURE_PATH = r"models\audio_feature_columns.pkl"


# ============================================================
# LOAD FACE MODEL
# ============================================================

print()
print("=" * 60)
print("LOADING FACE MODEL")
print("=" * 60)

try:
    FACE_MODEL_PATH = hf_hub_download(
        repo_id="dwest1507/emotion-detection-model",
        filename="emotion_classifier.onnx"
    )

    face_session = ort.InferenceSession(
        FACE_MODEL_PATH,
        providers=["CPUExecutionProvider"]
    )

    face_input_name = face_session.get_inputs()[0].name

    print("Facial model loaded successfully.")
    print("Face input:", face_input_name)

except Exception as e:
    print("ERROR loading facial model:")
    print(e)

    face_session = None
    face_input_name = None


# ============================================================
# LOAD AUDIO MODEL
# ============================================================

print()
print("=" * 60)
print("LOADING AUDIO MODEL")
print("=" * 60)

try:
    audio_model = joblib.load(
        AUDIO_MODEL_PATH
    )

    audio_feature_columns = joblib.load(
        AUDIO_FEATURE_PATH
    )

    print("Audio emotion model loaded successfully.")
    print(
        "Audio features:",
        len(audio_feature_columns)
    )

except Exception as e:
    print("ERROR loading audio model:")
    print(e)

    audio_model = None
    audio_feature_columns = None


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "online",
        "message": "H4H backend is running",
        "models": {
            "face": face_session is not None,
            "audio": audio_model is not None
        }
    })


# ============================================================
# TEST ENDPOINT
# ============================================================

@app.route("/api/test", methods=["POST"])
def test():

    data = request.get_json(silent=True)

    return jsonify({
        "success": True,
        "received": data
    })


# ============================================================
# FACE PREPROCESSING
# ============================================================

def preprocess_face(image):

    image = image.resize(
        (224, 224)
    )

    image = np.array(
        image,
        dtype=np.float32
    )

    image = image / 255.0

    image = np.transpose(
        image,
        (2, 0, 1)
    )

    image = np.expand_dims(
        image,
        axis=0
    )

    mean = np.array(
        [0.485, 0.456, 0.406],
        dtype=np.float32
    ).reshape(
        1, 3, 1, 1
    )

    std = np.array(
        [0.229, 0.224, 0.225],
        dtype=np.float32
    ).reshape(
        1, 3, 1, 1
    )

    image = (
        image - mean
    ) / std

    return image


# ============================================================
# FACE API
# ============================================================

@app.route(
    "/api/analyze/face",
    methods=["POST"]
)
def analyze_face():

    try:

        if face_session is None:
            return jsonify({
                "success": False,
                "error": "Facial model is not loaded."
            }), 500

        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image provided."
            }), 400

        file = request.files["image"]

        image_bytes = file.read()

        if not image_bytes:
            return jsonify({
                "success": False,
                "error": "Empty image file."
            }), 400

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image = preprocess_face(
            image
        )

        output = face_session.run(
            None,
            {
                face_input_name: image
            }
        )[0]

        logits = output[0]

        probabilities = np.exp(
            logits - np.max(logits)
        )

        probabilities = (
            probabilities /
            probabilities.sum()
        )

        prediction_index = int(
            np.argmax(probabilities)
        )

        prediction = FACE_EMOTIONS[
            prediction_index
        ]

        confidence = float(
            probabilities[
                prediction_index
            ]
        )

        probability_dict = {
            emotion: float(probability)
            for emotion, probability in zip(
                FACE_EMOTIONS,
                probabilities
            )
        }

        return jsonify({
            "success": True,
            "emotion": prediction,
            "confidence": confidence,
            "probabilities": probability_dict
        })

    except Exception as e:

        print()
        print("FACE ANALYSIS ERROR:")
        print(e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================
# AUDIO FEATURE EXTRACTION
# ============================================================

def extract_audio_features(audio_bytes):

    audio_buffer = io.BytesIO(
        audio_bytes
    )

    y, sr = librosa.load(
        audio_buffer,
        sr=None
    )

    duration = len(y) / sr

    # --------------------------------------------------------
    # MFCC
    # --------------------------------------------------------

    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=13
    )

    mfcc_mean = np.mean(
        mfcc,
        axis=1
    )

    mfcc_variance = np.var(
        mfcc,
        axis=1
    )

    # --------------------------------------------------------
    # PITCH
    # --------------------------------------------------------

    pitch, _, _ = librosa.pyin(
        y,
        fmin=50,
        fmax=500
    )

    pitch_values = pitch[
        ~np.isnan(pitch)
    ]

    if len(pitch_values) > 0:

        pitch_mean = float(
            np.mean(pitch_values)
        )

        pitch_std = float(
            np.std(pitch_values)
        )

    else:

        pitch_mean = 0.0
        pitch_std = 0.0

    # --------------------------------------------------------
    # ENERGY
    # --------------------------------------------------------

    rms = librosa.feature.rms(
        y=y
    )

    speech_energy = float(
        np.mean(rms)
    )

    energy_variance = float(
        np.var(rms)
    )

    # --------------------------------------------------------
    # ZERO CROSSING RATE
    # --------------------------------------------------------

    zcr = librosa.feature.zero_crossing_rate(
        y
    )

    zero_crossing_rate = float(
        np.mean(zcr)
    )

    # --------------------------------------------------------
    # CREATE FEATURE DICTIONARY
    # --------------------------------------------------------

    features = {
        "duration": duration,
        "pitch_mean": pitch_mean,
        "pitch_std": pitch_std,
        "speech_energy": speech_energy,
        "energy_variance": energy_variance,
        "zero_crossing_rate": zero_crossing_rate
    }

    for i in range(13):

        features[
            f"mfcc_{i + 1}_mean"
        ] = float(
            mfcc_mean[i]
        )

    for i in range(13):

        features[
            f"mfcc_{i + 1}_variance"
        ] = float(
            mfcc_variance[i]
        )

    X = pd.DataFrame(
        [features]
    )

    # --------------------------------------------------------
    # MATCH TRAINING COLUMNS
    # --------------------------------------------------------

    for column in audio_feature_columns:

        if column not in X.columns:
            X[column] = 0.0

    X = X[
        audio_feature_columns
    ]

    X = X.replace(
        [np.inf, -np.inf],
        np.nan
    )

    X = X.fillna(0)

    return X


# ============================================================
# AUDIO API
# ============================================================

@app.route(
    "/api/analyze/audio",
    methods=["POST"]
)
def analyze_audio():

    try:

        if audio_model is None:
            return jsonify({
                "success": False,
                "error": "Audio model is not loaded."
            }), 500

        if "audio" not in request.files:
            return jsonify({
                "success": False,
                "error": "No audio file provided."
            }), 400

        file = request.files["audio"]

        audio_bytes = file.read()

        if not audio_bytes:
            return jsonify({
                "success": False,
                "error": "Empty audio file."
            }), 400

        print()
        print("=" * 60)
        print("AUDIO REQUEST RECEIVED")
        print("=" * 60)

        X = extract_audio_features(
            audio_bytes
        )

        print(
            "Features extracted:",
            X.shape
        )

        prediction = audio_model.predict(
            X
        )[0]

        probabilities = (
            audio_model.predict_proba(
                X
            )[0]
        )

        classes = audio_model.classes_

        confidence = float(
            np.max(probabilities)
        )

        probability_dict = {
            str(emotion): float(probability)
            for emotion, probability in zip(
                classes,
                probabilities
            )
        }

        print(
            "Predicted emotion:",
            prediction
        )

        print(
            "Confidence:",
            f"{confidence:.2%}"
        )

        return jsonify({
            "success": True,
            "emotion": str(prediction),
            "confidence": confidence,
            "probabilities": probability_dict
        })

    except Exception as e:

        print()
        print("AUDIO ANALYSIS ERROR:")
        print(e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================================
# START FLASK SERVER
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("H4H BACKEND")
    print("=" * 60)

    print()
    print(
        "Face model:",
        "READY" if face_session is not None else "FAILED"
    )

    print(
        "Audio model:",
        "READY" if audio_model is not None else "FAILED"
    )

    print()
    print("Starting Flask server...")
    print()
    print("Local URL:")
    print("http://127.0.0.1:5000")

    print()
    print("Network URL:")
    print("http://0.0.0.0:5000")

    print()
    print("=" * 60)
    print()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        threaded=True
    )