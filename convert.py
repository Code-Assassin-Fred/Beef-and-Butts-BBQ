from pathlib import Path
from PIL import Image
import pillow_heif

# Folder containing the HEIC files
assets_folder = Path(r"C:\Users\HP\Documents\beefnbuttsbbq\public\Assets")

# Enable HEIC support
pillow_heif.register_heif_opener()

# Convert every HEIC/HEIF file in the folder
for heic_file in assets_folder.iterdir():
    if heic_file.suffix.lower() not in [".heic", ".heif"]:
        continue

    # Output as JPG with the same filename
    output_file = heic_file.with_suffix(".jpg")

    try:
        with Image.open(heic_file) as image:
            # Convert to RGB for JPEG compatibility
            if image.mode != "RGB":
                image = image.convert("RGB")

            # High-quality JPEG
            image.save(
                output_file,
                "JPEG",
                quality=100,
                subsampling=0,
                optimize=True
            )

        # Delete original HEIC only after successful conversion
        heic_file.unlink()

        print(f"Converted: {heic_file.name} -> {output_file.name}")

    except Exception as e:
        print(f"FAILED: {heic_file.name}")
        print(f"Error: {e}")

print("\nConversion complete.")