# backend/animal/utils.py

def analyze_image(image_path):
    from PIL import Image

    img = Image.open(image_path)
    tags = ["urgent need of help", "injured", "stray"]  # Example tags
    return tags
