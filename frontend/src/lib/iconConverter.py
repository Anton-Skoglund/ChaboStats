import os
import re
import json

# --- SVG to FA converter ---
def svg_to_fa(file_path, name):
    with open(file_path, "r", encoding="utf-8") as f:
        svg = f.read()

    # Extract viewBox
    viewbox_match = re.search(r'viewBox="([^"]+)"', svg)
    if not viewbox_match:
        raise ValueError(f"SVG missing viewBox: {file_path}")
    viewbox = viewbox_match.group(1)
    _, _, w, h = map(float, viewbox.split())

    # Extract all <path d="...">
    paths = re.findall(r'<path[^>]*d="([^"]+)"', svg)

    return {
        "prefix": "fac",
        "iconName": name,
        "icon": [
            w,
            h,
            [],
            None,
            paths[0] if len(paths) == 1 else paths
        ]
    }

# --- Convert all SVGs in a folder ---
folder_path = "./svgs"  # replace with your folder path
output_file = "./ownIcons.ts"

files = [f for f in os.listdir(folder_path) if f.endswith(".svg")]

icons = []
for f in files:
    full_path = os.path.join(folder_path, f)
    name = os.path.splitext(f)[0]  # file name without extension
    icons.append(svg_to_fa(full_path, name))

# --- Generate TS file content ---
ts_content = 'import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";\n\n'

for icon in icons:
    ts_content += f"export const {icon['iconName']} = {json.dumps(icon, indent=2)};\n\n"

ts_content += "export { FontAwesomeIcon };"

# --- Write to file ---
with open(output_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Converted {len(icons)} SVGs to Font Awesome objects in {output_file}")
