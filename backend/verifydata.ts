// schemas/apartmentSchema.ts
export const apartmentSchema = {
  type: "object",
  required: [
    "published",
    "objectId",
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
    "source_file"
  ],
  properties: {
    published: { type: "string" },
    objectId: { type: "string" },
    location: { type: "string" },
    address: { type: "string" },
    type: { type: "string" },
    size_sqrM: { type: "number" },
    floor: {
      type: "object",
      required: ["floor", "total_floors"],
      properties: {
        floor: { type: "number" },
        total_floors: { type: "number" }
      }
    },
    rent_krPerMonth: { type: "number" },
    move_in: { type: "string" },
    interested_count: { type: "number" },
    features: { type: "array", items: { type: "string" } },
    descriptions: { type: "array", items: { type: "string" } },
    source_file: { type: "string" }
  },
  additionalProperties: false
};
