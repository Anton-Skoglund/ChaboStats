# Validate an apartment object
from jsonschema import validate, ValidationError
import json

# Load the JSON Schema from a file
with open("static.json", "r") as f:
    schema = json.load(f)

location_codes = set()
location_names = set()
buildings = schema["cha_stu_bo"]["building"]


for entry in buildings:
    location_codes.add(entry["code"])
    if "alias" in entry:
        location_names.update(entry["alias"]) # because it is a list




apartment_schema = {
    "type": "object",
    "properties": {
        "published": {"type": "string"},
        "objectId": {"type": "string"},
        "locationCode": {
            "type": "string",
            "enum": list(location_codes)               
        },
        "location": {
            "type": "string",
            "enum": list(location_names)  # only allow valid names/aliases
        },        
        "address": {"type": "string"},
        "type": {"type": "string"},
        "size_sqrM": {"type": "number"},
        "floor": {
            "type": "object",
            "properties": {
                "floor": {"type": "number"},
                "total_floors": {"type": "number"}
            },
            "required": ["floor", "total_floors"]
        },
        "rent_krPerMonth": {"type": "number"},
        "move_in": {"type": "string"},
        "interested_count": {"type": "number"},
        "features": {
            "type": "object",
            "properties": {
                "features": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "searchable_features": {
                    "type": "object",
                    "properties": {
                        "balcony": {"type": ["boolean", "null"]},
                        "power_individual_measurement": {"type": ["boolean", "null"]},
                        "hot_water_individual_measurement": {"type": ["boolean", "null"]},
                        "cycling_room": {"type": ["boolean", "null"]}
                    },
                    "required": [
                        "balcony",
                        "power_individual_measurement",
                        "hot_water_individual_measurement",
                        "cycling_room"
                    ]
                }
            },
            "required": ["features", "searchable_features"]
        },
        "descriptions": {
            "type": "array",
            "items": {"type": "string"}
        },
        "source_file": {"type": "string"},
        "image_file": {"type": ["string", "null"]}
    },
    "required": [
        "published",
        "objectId",
        "locationCode",
        "location",
        "address",
        "type",
        "size_sqrM",
        "floor",
        "rent_krPerMonth",
        "move_in",
        "interested_count",
        "features",
        "descriptions",
        "source_file",
        "image_file"
    ]
}




def verify_apartment(apartment_data):
    try:
        validate(instance=apartment_data, schema=apartment_schema)
    except ValidationError as e:
        # Get the path to the problematic field
        field_path = ".".join(str(p) for p in e.path)
        raise ValueError(f"Invalid field '{field_path}': {e.message}")
    