import os
import numpy as np
import pandas as pd
import onnxruntime as ort
from PIL import Image

MODEL_PATH = "emotion_classifier.onnx"
IMAGE_ROOT = os.path.join("image data", "Extracted_images")
OUTPUT_FILE = "face_features.csv"

emotions = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

stress_mapping = {
    "Happy": "Healthy",
    "Neutral": "Healthy",
    "Sad": "Mild_Stress",
    "Surprise": "Mild_Stress",
    "Fear": "Moderate_Stress",
    "Disgust": "Moderate_Stress",
    "Angry": "Severe_Stress"
}

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"]
)

input_name = session.get_inputs()[0].name

mean = np.array(
    [0.485, 0.456, 0.406],
    dtype=np.float32
).reshape(1, 3, 1, 1)

std = np.array(
    [0.229, 0.224, 0.225],
    dtype=np.float32
).reshape(1, 3, 1, 1)

results = []

for emotion in emotions:

    folder = os.path.join(
        IMAGE_ROOT,
        emotion
    )

    files = [
        f for f in os.listdir(folder)
        if f.lower().endswith(".png")
    ]

    print(f"Processing {emotion}: {len(files)} images")

    for i, file in enumerate(files, 1):

        path = os.path.join(folder, file)

        image = Image.open(path).convert("RGB")
        image = image.resize((224, 224))

        image = np.array(
            image,
            dtype=np.float32
        ) / 255.0

        image = np.transpose(
            image,
            (2, 0, 1)
        )

        image = np.expand_dims(
            image,
            axis=0
        )

        image = (image - mean) / std

        output = session.run(
            None,
            {input_name: image}
        )[0]

        probabilities = np.exp(
            output[0] - np.max(output[0])
        )

        probabilities /= probabilities.sum()

        prediction = np.argmax(probabilities)

        predicted_emotion = emotions[prediction]
        predicted_stress = stress_mapping[predicted_emotion]

        results.append({
            "filename": file,
            "actual_emotion": emotion,
            "predicted_emotion": predicted_emotion,
            "predicted_stress": predicted_stress,
            "angry_probability": probabilities[0],
            "disgust_probability": probabilities[1],
            "fear_probability": probabilities[2],
            "happy_probability": probabilities[3],
            "sad_probability": probabilities[4],
            "surprise_probability": probabilities[5],
            "neutral_probability": probabilities[6],
            "confidence": probabilities[prediction]
        })

        if i % 100 == 0:
            print(f"{emotion}: {i}/{len(files)}")

df = pd.DataFrame(results)

df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nProcessing complete.")
print(f"Total images: {len(df)}")
print(f"Saved to: {OUTPUT_FILE}")