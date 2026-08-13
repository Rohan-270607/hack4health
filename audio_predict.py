import os
import sys
import joblib
import numpy as np
import pandas as pd
import librosa

MODEL_PATH = "models/audio_emotion_model.pkl"
FEATURE_PATH = "models/audio_feature_columns.pkl"

if len(sys.argv) < 2:
    print("Usage:")
    print('python audio_predict.py "path_to_audio.wav"')
    sys.exit(1)

audio_path = sys.argv[1]

if not os.path.exists(audio_path):
    print("Audio file not found:")
    print(audio_path)
    sys.exit(1)

# Load model
model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)

# Load audio
print()
print("Loading audio...")
print(audio_path)

y, sr = librosa.load(
    audio_path,
    sr=None
)

duration = len(y) / sr

print(f"Sample rate: {sr}")
print(f"Duration: {duration:.2f} seconds")

# MFCC
print()
print("Extracting audio features...")

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
    pitch_mean = float(np.mean(pitch_values))
    pitch_std = float(np.std(pitch_values))
else:
    pitch_mean = 0.0
    pitch_std = 0.0

# Energy
rms = librosa.feature.rms(y=y)

speech_energy = float(
    np.mean(rms)
)

energy_variance = float(
    np.var(rms)
)

# Zero crossing rate
zcr = librosa.feature.zero_crossing_rate(y)

zero_crossing_rate = float(
    np.mean(zcr)
)

# Build feature dictionary
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
    ] = float(mfcc_mean[i])

for i in range(13):
    features[
        f"mfcc_{i + 1}_variance"
    ] = float(mfcc_variance[i])

# Convert to DataFrame
X = pd.DataFrame([features])

# Make sure feature order matches training
for column in feature_columns:
    if column not in X.columns:
        X[column] = 0.0

X = X[feature_columns]

X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

X = X.fillna(0)

# Predict
print()
print("Running emotion model...")

prediction = model.predict(X)[0]

probabilities = model.predict_proba(X)[0]

classes = model.classes_

# Display results
print()
print("=" * 45)
print("AUDIO EMOTION ANALYSIS")
print("=" * 45)

print()
print("Predicted Emotion:")
print(prediction)

print()
print("Emotion Probabilities:")

results = sorted(
    zip(classes, probabilities),
    key=lambda x: x[1],
    reverse=True
)

for emotion, probability in results:
    print(
        f"{emotion:<12} {probability:.2%}"
    )

print()
print("=" * 45)