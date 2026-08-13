from PIL import Image
import os

path = r"image data\Extracted_images\Angry\0.png"

img = Image.open(path)

print("Format:", img.format)
print("Size:", img.size)
print("Mode:", img.mode)