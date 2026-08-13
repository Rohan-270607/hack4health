import os
import joblib
import numpy as np
import pandas as pd
import librosa

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

MODEL_PATH = "models/audio_emotion_model.pkl"
FEATURE_PATH = "models/audio_feature_columns.pkl"

AUDIO_ROOT = os.path.join(
    "audio data",
    "Audios"
)

FILES_PER_EMOTION = 5

emotion_mapping = {
    "01": "Neutral",
    "02": "Calm",
    "03": "Happy",
    "04": "Sad",
    "05": "Angry",
    "06": "Fear",
    "07": "Disgust",
    "08": "Surprise"
}


# ==========================================================
# LOAD MODEL
# ==========================================================

model = joblib.load(MODEL_PATH)

feature_columns = joblib.load(
    FEATURE_PATH
)


# ==========================================================
# FEATURE EXTRACTION
# ==========================================================

def extract_features(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    duration = len(y) / sr

    # MFCC
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

    # Pitch
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

    # Energy
    rms = librosa.feature.rms(
        y=y
    )

    speech_energy = float(
        np.mean(rms)
    )

    energy_variance = float(
        np.var(rms)
    )

    # Zero crossing rate
    zcr = librosa.feature.zero_crossing_rate(
        y
    )

    zero_crossing_rate = float(
        np.mean(zcr)
    )

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

    # Match training feature order
    for column in feature_columns:

        if column not in X.columns:
            X[column] = 0.0

    X = X[
        feature_columns
    ]

    X = X.replace(
        [np.inf, -np.inf],
        np.nan
    )

    X = X.fillna(0)

    return X


# ==========================================================
# FIND AUDIO FILES
# ==========================================================

all_files = []

for root, _, filenames in os.walk(
    AUDIO_ROOT
):

    for filename in filenames:

        if filename.lower().endswith(".wav"):

            all_files.append(
                os.path.join(
                    root,
                    filename
                )
            )

all_files.sort()


# ==========================================================
# SELECT 5 FILES PER EMOTION
# ==========================================================

selected_files = []

emotion_counts = {
    emotion: 0
    for emotion in emotion_mapping.values()
}

for path in all_files:

    filename = os.path.basename(
        path
    )

    parts = filename.replace(
        ".wav",
        ""
    ).split("-")

    if len(parts) < 3:
        continue

    emotion_code = parts[2]

    emotion = emotion_mapping.get(
        emotion_code
    )

    if emotion is None:
        continue

    if emotion_counts[emotion] < FILES_PER_EMOTION:

        selected_files.append(
            path
        )

        emotion_counts[emotion] += 1


# ==========================================================
# DISPLAY TEST SET
# ==========================================================

print("=" * 60)
print("AUDIO BATCH TEST")
print("=" * 60)

print()

for emotion, count in emotion_counts.items():

    print(
        f"{emotion:<10}: {count} files"
    )

print()

print(
    f"Total test files: {len(selected_files)}"
)


# ==========================================================
# RUN PREDICTIONS
# ==========================================================

y_true = []
y_pred = []
confidences = []

print()
print("=" * 60)
print("PROCESSING")
print("=" * 60)

for index, audio_path in enumerate(
    selected_files,
    1
):

    filename = os.path.basename(
        audio_path
    )

    parts = filename.replace(
        ".wav",
        ""
    ).split("-")

    emotion_code = parts[2]

    actual_emotion = emotion_mapping[
        emotion_code
    ]

    try:

        X = extract_features(
            audio_path
        )

        prediction = model.predict(
            X
        )[0]

        probabilities = model.predict_proba(
            X
        )[0]

        confidence = float(
            np.max(probabilities)
        )

        y_true.append(
            actual_emotion
        )

        y_pred.append(
            prediction
        )

        confidences.append(
            confidence
        )

        status = "✓" if (
            actual_emotion == prediction
        ) else "✗"

        print(
            f"{index:02d}. "
            f"{actual_emotion:<10} → "
            f"{prediction:<10} "
            f"{confidence:.2%} "
            f"{status}"
        )

    except Exception as e:

        print(
            f"{index:02d}. ERROR: "
            f"{filename}"
        )

        print(e)


# ==========================================================
# RESULTS
# ==========================================================

print()
print("=" * 60)
print("BATCH TEST RESULTS")
print("=" * 60)

accuracy = accuracy_score(
    y_true,
    y_pred
)

print()
print(
    f"Accuracy: {accuracy:.2%}"
)

print()
print(
    f"Average Confidence: "
    f"{np.mean(confidences):.2%}"
)


# ==========================================================
# CLASSIFICATION REPORT
# ==========================================================

labels = list(
    emotion_mapping.values()
)

print()
print("Classification Report:")
print()

print(
    classification_report(
        y_true,
        y_pred,
        labels=labels,
        zero_division=0
    )
)


# ==========================================================
# CONFUSION MATRIX
# ==========================================================

print("Confusion Matrix:")

cm = confusion_matrix(
    y_true,
    y_pred,
    labels=labels
)

print()

print(
    "Labels:"
)

print(labels)

print()

print(cm)

print()
print("=" * 60)
print("TEST COMPLETE")
print("=" * 60)