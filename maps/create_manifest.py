import os
import json

# Folder to scan
root_folder = "."  # current folder

# List to hold all file paths
file_list = []

# Walk through folder and subfolders
for dirpath, dirnames, filenames in os.walk(root_folder):
    for filename in filenames:
        if filename.endswith(".json"):
            # Create relative path from root_folder
            relative_path = os.path.relpath(os.path.join(dirpath, filename), root_folder)
            # Use forward slashes for web paths
            relative_path = relative_path.replace("\\", "/")
            file_list.append(relative_path)

# Save to manifest.json
with open("manifest.json", "w") as f:
    json.dump(file_list, f, indent=2)

print(f"Manifest created with {len(file_list)} files.")
