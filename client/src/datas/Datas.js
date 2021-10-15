export const occupancyCategory = [
    {
        category: 'Office Building', children: [
            { subcategory: "Office Space", density: "5" },
            { subcategory: "Reception Area", density: "30" },
            { subcategory: "Telephone/data entry", density: "60" },
            { subcategory: "Main entry hobbies", density: "10" },
        ]
    },
    {
        category: "Miscellaneous Spaces", children: [
            { subcategory: "Bank vaults/safe deposit", density: "5" },
            { subcategory: "Computer (not printing)", density: "4" },
            { subcategory: "Electrical equipment", density: "-" },
            { subcategory: "Elevator machine room", density: "-" },
            { subcategory: "Pharmacy (prep. area)", density: "10" },
            { subcategory: "Photo studios", density: "10" },
            { subcategory: "Shipping/receiving", density: "-" },
            { subcategory: "Telephone closets", density: "-" },
            { subcategory: "Transportation waiting", density: "100" },
            { subcategory: "Warehouses", density: "-" },
        ]
    },
    {
        category: "Public Assembly Spaces", children: [
            { subcategory: "Auditorium seating area", density: "150" },
            { subcategory: "Places of religious worship", density: "120" },
            { subcategory: "Courtrooms", density: "70" },
            { subcategory: "Legislative chambers", density: "50" },
            { subcategory: "Libraries", density: "10" },
            { subcategory: "Lobbies", density: "150" },
            { subcategory: "Museums (children's)", density: "40" },
            { subcategory: "Museums/galleries", density: "40" },
        ]
    },
    {
        category: "Residential", children: [
            { subcategory: "Dwelling unit", density: "F" },
            { subcategory: "Common corridors", density: "-" },
        ]
    }
];