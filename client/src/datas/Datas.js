export const formChapters = [
    { chapter: "1", title: "Building Data" },
    { chapter: "2", title: "Passive Design Strategy for Building Envelope" },
    { chapter: "3", title: "Active Design Strategy" },
    { chapter: "4", title: "Building Health and Comfort Design" },
    { chapter: "5", title: "Renewable Energy Source" },
    { chapter: "6", title: "Design Portfolio, Recommendation" },
]

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
    },
    {
        category: "Retail", children: [
            { subcategory: "Sales", density: "15" },
            { subcategory: "Mall common area", density: "40" },
            { subcategory: "Barbershop", density: "25" },
            { subcategory: "Beauty and nail salons", density: "25" },
            { subcategory: "Pet shops (animal areas)", density: "10" },
            { subcategory: "Supermarket", density: "8" },
            { subcategory: "Coin-operated laundries", density: "20" },
        ]
    }
];

export const buildingTypology = [
    {
        type: "Homes",
        eci: "240 kWh/m2 per year", 
        visual: "200-300 lux", 
        acoustic: "30-35 dBA"
    },
    {
        type: "Apartment",
        eci: "300 kWh/m2 per year", 
        visual: "200-300 lux", 
        acoustic: "30-35 dBA"
    },
    {
        type: "Office",
        eci: "240 kWh/m2 per year", 
        visual: "300-500 lux", 
        acoustic: "30-45 dBA"
    },
    {
        type: "Mall",
        eci: "330 kWh/m2 per year", 
        visual: "500-700 lux", 
        acoustic: "40-55 dBA"
    },
    {
        type: "Hotel",
        eci: "300 kWh/m2 per year", 
        visual: "200-300 lux", 
        acoustic: "30-35 dBA"
    },
    {
        type: "Hospital",
        eci: "380 kWh/m2 per year", 
        visual: "500-1000 lux", 
        acoustic: "30-35 dBA"
    },
];

export const AchReference = [
    {
        volumePerPerson: "3",
        minFreshAirPerPerson: "12",
        recFreshAirPerPerson: "17"
    },
    {
        volumePerPerson: "6",
        minFreshAirPerPerson: "7",
        recFreshAirPerPerson: "11"
    },
    {
        volumePerPerson: "9",
        minFreshAirPerPerson: "5",
        recFreshAirPerPerson: "8"
    },
    {
        volumePerPerson: "12",
        minFreshAirPerPerson: "4",
        recFreshAirPerPerson: "6"
    },
]