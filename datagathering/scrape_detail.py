import json
import os
import re
import time
from playwright.sync_api import sync_playwright

import msg 
import verifier

# CHANGE
folder = "2025-08-20/details"
all_results = []

with open("static.json", "r") as f:
    schema = json.load(f)

buildings = schema["cha_stu_bo"]["building"]

# Precompute lookup
alias_to_code = {}

for entry in buildings:
    code = entry["code"]
    alias_to_code[code.lower()] = code  # include code itself as alias
    if "alias" in entry:
        for a in entry["alias"]:
            alias_to_code[a.lower()] = code

msg.banner(f"Starting detail extraction from HTML files in {folder}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    files = os.listdir(folder)
    total = len(files)
    msg.banner(f"Found {total} files in {folder}")

    start_time = time.time()  # record when processing starts

    for i, filename in enumerate(files, start=1):
        msg.loading(total, i, filename, start_time=start_time)

        if filename.endswith(".html"):
            local_file = os.path.abspath(os.path.join(folder, filename))
            url = f"file://{local_file}"

            page.goto(url)
            page.wait_for_timeout(200)

            location_text = (
                page.query_selector("dd.ObjektOmrade").inner_text().strip().lower()
                if page.query_selector("dd.ObjektOmrade") else None
            )

            result = {
                "location": location_text,
                "locationCode": alias_to_code.get(location_text) if location_text else None,
            }


            details = {
                "published": None,
                "objectId": page.query_selector("dd.ObjektNummer").inner_text().strip() if page.query_selector("dd.ObjektNummer") else None,
                "locationCode": alias_to_code.get(location_text) if location_text else None,
                "location": location_text,
                "address": page.query_selector("dd.ObjektAdress").inner_text().strip() if page.query_selector("dd.ObjektAdress") else None,
                "type": page.query_selector("dd.ObjektTyp").inner_text().strip() if page.query_selector("dd.ObjektTyp") else None,
                "size_sqrM": None,
                "floor": { "floor": None, "total_floors": None },   # unified schema
                "rent_krPerMonth": None,
                "move_in": page.query_selector("dd.ObjektInflytt").inner_text().strip() if page.query_selector("dd.ObjektInflytt") else None,
                "interested_count": None,
                "features": [],   # list of features
                "descriptions": [],  # list of publishing texts
                "source_file": f"{folder}/{filename}",
                "image_file": None
            }

            base = filename.rsplit(".", 1)[0]  # strip extension
            pdf_path = f"{folder}/{base}.pdf"
            png_path = f"{folder}/{base}.png"

            if os.path.exists(pdf_path):
                image_file = pdf_path
            elif os.path.exists(png_path):
                image_file = png_path
            else:
                image_file = None

            details["image_file"] = image_file

            # descriptions
            desc_blocks = page.query_selector_all(".Objektpubliceringstexter .Publiceringstext")
            descriptions = [d.inner_text().strip() for d in desc_blocks if d.inner_text().strip()]
            details["descriptions"] = descriptions

            # size
            size_raw = page.query_selector("dd.ObjektYta")
            if size_raw:
                details["size_sqrM"] = float(size_raw.inner_text().replace("m²", "").strip())
            
            # floor
            details["floor"] = { "floor": None, "total_floors": None }

            floor_raw = page.query_selector("dd.ObjektVaning")
            if floor_raw:
                floor_text = floor_raw.inner_text().strip()
                floor_data = list(map(str.strip, floor_text.split("av")))

                if len(floor_data) == 2:
                    if not floor_data[0].isdigit():
                        if floor_data[0] == "Bottenvåning" or "1 under":
                            floor_data[0] = "0"
                        elif floor_data[0] == "Vind":
                            floor_data[0] = floor_data[1]

                    details["floor"] = {
                        "floor": int(floor_data[0]) if floor_data[0].isdigit() else None,
                        "total_floors": int(floor_data[1]) if floor_data[1].isdigit() else None
                    }

            # rent
            rent_raw = page.query_selector("dd.ObjektHyra")
            if rent_raw:
                rent_text = rent_raw.inner_text().replace("kr/mån", "").replace("\xa0", "").strip()
                try:
                    details["rent_krPerMonth"] = int(rent_text)
                except ValueError:
                    details["rent_krPerMonth"] = None

            # published date from IntresseMeddelande
            msg_raw = page.query_selector(".IntresseMeddelande")
            if msg_raw:
                msg_text = msg_raw.inner_text()
                match = re.search(r"(\d{4}-\d{2}-\d{2})", msg_text)
                if match:
                    details["published"] = match.group(1)

            # interested count
            intresse_raw = page.query_selector(".Objektintressestatus")
            if intresse_raw:
                txt = intresse_raw.inner_text()
                match = re.search(r"(\d+)", txt)
                if match:
                    details["interested_count"] = int(match.group(1))


            # features (structured)
            feature_items = page.query_selector_all(".ObjektEgenskaper .PropertyItem span")
            raw_features = [f.inner_text().strip() for f in feature_items if f.inner_text().strip()]

            # map to searchable_features
            searchable_features = {
                "corner": None,
                "balcony": None,
                "storage": any("förråd" in f.lower() for f in raw_features),
                "power_individual_measurement": any("individuell elmätning" in f.lower() for f in raw_features),
                "hot_water_individual_measurement": any("individuell varmvattenmätning" in f.lower() for f in raw_features),
                "cycling_room": any("cykel" in f.lower() for f in raw_features)
            }

            details["features"] = {
                "features": raw_features,
                "searchable_features": searchable_features
            }

            
            try:
                verifier.verify_apartment(details)
            except ValueError as e:
                print()
                msg.banner(f"Validation error in file {filename}: {e}", msg.BannerType.ERROR)


            all_results.append(details)

    browser.close()

msg.banner(f"Done. Extracted {len(all_results)} entries with features from {folder}", msg.BannerType.SUCCESS)

# then dump
with open("details.json", "w", encoding="utf-8") as f:
    json.dump(all_results, f, indent=2, ensure_ascii=False)


