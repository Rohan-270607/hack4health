import os
import requests

FOLDER = r"D:\Projects\H4H\image data\Extracted_images\Disgust"

files = [
    f for f in os.listdir(FOLDER)
    if f.lower().endswith((".png", ".jpg", ".jpeg"))
]

if not files:
    print("No images found.")
    exit()

IMAGE_PATH = os.path.join(
    FOLDER,
    files[0]
)

print("Testing image:")
print(IMAGE_PATH)

with open(IMAGE_PATH, "rb") as image:

    response = requests.post(
        "http://127.0.0.1:5000/api/analyze/face",
        files={
            "image": image
        }
    )

print()
print("Status Code:", response.status_code)

print()
print("Response:")

print(response.json())