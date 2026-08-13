import os
import joblib
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestClassifier


DATA_FILE = "audio_features.csv"
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_FILE)

excluded_columns = [
    "filepath",
    "filename",
    "actor_id",
    "emotion",
    "emotion_code",
    "intensity_code",
    "statement_code",
    "repetition_code",
    "sample_rate"
]

feature_columns = [
    col for col in df.columns
    if col not in excluded_columns
]

X = df[feature_columns]
y = df["emotion"]

X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

X = X.fillna(
    X.median(numeric_only=True)
)

print("Training final Random Forest...")
print(f"Samples: {len(X)}")
print(f"Features: {len(feature_columns)}")

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)

model.fit(X, y)

model_path = os.path.join(
    MODEL_DIR,
    "audio_emotion_model.pkl"
)

joblib.dump(
    model,
    model_path
)

feature_path = os.path.join(
    MODEL_DIR,
    "audio_feature_columns.pkl"
)

joblib.dump(
    feature_columns,
    feature_path
)

print()
print("Model saved:")
print(model_path)

print()
print("Feature columns saved:")
print(feature_path)

print()
print("Audio model ready.")