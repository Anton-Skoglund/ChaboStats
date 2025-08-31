import json
import os


with open("details.json", "r", encoding="utf-8") as f:
    all_results = json.load(f)

for entry in all_results:
    features = entry.setdefault("features", {}).setdefault("searchable_features", {})

    if features.get("corner") is None or features.get("balcony") is None:
        path = entry.get("image_file")
        if path:
            abs_path = os.path.abspath(path)
            print(f'file://{abs_path}')
        else:
            print("No image file")

        if features.get("corner") is None:
            while True:
                ans = input("Corner? [y/n/u]: ").strip().lower()
                if ans in ("y", "n", "u"):
                    features["corner"] = True if ans == "y" else False if ans == "n" else None
                    break
                print("Please enter y, n, or u.")

        if features.get("balcony") is None:
            while True:
                ans = input("Balcony? [y/n/u]: ").strip().lower()
                if ans in ("y", "n", "u"):
                    features["balcony"] = True if ans == "y" else False if ans == "n" else None
                    break
                print("Please enter y, n, or u.")

        # immediately save after each update
        with open("details.json", "w", encoding="utf-8") as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)