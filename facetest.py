import os
import numpy as np
import onnxruntime as ort
from PIL import Image
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

model_path = "emotion_classifier.onnx"

session = ort.InferenceSession(
    model_path,
    providers=["CPUExecutionProvider"]
)

emotions = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

input_name = session.get_inputs()[0].name

y_true = []
y_pred = []
confidences = []

for emotion in emotions:
    folder = os.path.join(
        "image data",
        "Extracted_images",
        emotion
    )

    files = [
        f for f in os.listdir(folder)
        if f.lower().endswith(".png")
    ][:5]

    for file in files:
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

        mean = np.array(
            [0.485, 0.456, 0.406],
            dtype=np.float32
        ).reshape(1, 3, 1, 1)

        std = np.array(
            [0.229, 0.224, 0.225],
            dtype=np.float32
        ).reshape(1, 3, 1, 1)

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

        y_true.append(emotion)
        y_pred.append(emotions[prediction])
        confidences.append(probabilities[prediction])

print("\nAccuracy:")
print(f"{accuracy_score(y_true, y_pred):.2%}")

print("\nClassification Report:")
print(
    classification_report(
        y_true,
        y_pred,
        labels=emotions,
        zero_division=0
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_true,
        y_pred,
        labels=emotions
    )
)

print(
    "\nAverage Confidence:",
    f"{np.mean(confidences):.2%}"
)