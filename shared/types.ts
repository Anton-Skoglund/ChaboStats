
interface Floor {
    floor: number;
    total_floors: number;
}

export interface SearchableFeatures {
    corner: boolean | null;
    balcony: boolean | null;
    power_individual_measurement: boolean | null;
    hot_water_individual_measurement: boolean | null;
    cycling_room: boolean | null;
}
export interface Apartment {
    published: string;          // e.g., "2025-08-20"
    objectId: string;           // e.g., "63030857"
    locationCode: string;
    location: string;           // e.g., "Emilsborg"
    address: string;            // e.g., "Gibraltargatan 92"
    type: string;               // e.g., "2 rum med trinett"
    size_sqrM: number;          // e.g., 28.0
    floor: Floor;
    rent_krPerMonth: number;    // e.g., 5704
    move_in: string;            // e.g., "2025-09-11"
    interested_count: number;   // e.g., 73
    features: {
        features: string[];          // list of features
        searchable_features: SearchableFeatures;
    };         
    descriptions: string[];     // array of description paragraphs
    source_file: string;        // e.g., "2025-08-20/details/63030857.html"
    image_file: string;
}