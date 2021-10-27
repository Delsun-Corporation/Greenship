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

export const lpdReference = [
    {
        type: "Homes", children: [
            {room: "Terrace", value: "3"},
            {room: "Guestroom", value: "7"},
            {room: "Dining Room", value: "7"},
            {room: "Workspace", value: "7"},
            {room: "Bedroom", value: "7"},
            {room: "Bathroom", value: "7"},
            {room: "Kitchen", value: "7"},
            {room: "Garage", value: "3"},
        ]
    },
    {
        type: "Office Building", children: [
            {room: "Receptionist", value: "13"},
            {room: "Director Room", value: "13"},
            {room: "Work Room", value: "12"},
            {room: "Computer Room", value: "12"},
            {room: "Meeting Room", value: "12"},
            {room: "Drawing Room", value: "20"},
            {room: "Archive Storage", value: "6"},
            {room: "Active Archive Room", value: "12"},
            {room: "Emergency Stairs", value: "4"},
            {room: "Parking Space", value: "4"},
        ]
    },
    {
        type: "Education Institution", children: [
            {room: "Classroom", value: "15"},
            {room: "Library", value: "11"},
            {room: "Laboratory", value: "13"},
            {room: "Computer Lab", value: "12"},
            {room: "Language Lab", value: "13"},
            {room: "Teacher Room", value: "12"},
            {room: "Sports Area", value: "12"},
            {room: "Drawing Room", value: "20"},
            {room: "Canteen", value: "8"},
        ]
    },
    {
        type: "Hotels and Restaurants", children: [
            {room: "Receptionist & Cashier", value: "12"},
            {room: "Lobby", value: "12"},
            {room: "Multipurpose Room", value: "8"},
            {room: "Meeting Room", value: "10"},
            {room: "Dining Room", value: "9"},
            {room: "Cafetaria", value: "8"},
            {room: "Bedroom", value: "7"},
            {room: "Corridor", value: "5"},
            {room: "Kitchen", value: "10"},
        ]
    },
    {
        type: "Hospital", children: [
            {room: "Intensive Care Room", value: "15"},
            {room: "Action Room", value: "15"},
            {room: "Recreation and Rehabilitation Room", value: "15"},
            {room: "Healing Room", value: "810"},
            {room: "Corridor Room (Day)", value: "8"},
            {room: "Corridor Room (Night)", value: "9"},
            {room: "Staff Room & Office", value: "3"},
            {room: "Rest Area", value: "10"},
            {room: "Patient Room", value: "7"},
        ]
    },
    {
        type: "Shops and Showrooms", children: [
            {room: "Large Items Showroom (e.g. cars)", value: "13"},
            {room: "Small Sales Area", value: "10"},
            {room: "Large Sales Area", value: "15"},
            {room: "Cashier", value: "15"},
            {room: "Bakery & Food Market", value: "9"},
            {room: "Flower Market", value: "9"},
            {room: "Bookstore & Stationery", value: "9"},
            {room: "Jewelry & Watch Store ", value: "15"},
            {room: "Shoe & Leather-made Store", value: "15"},
            {room: "Clothing Store", value: "15"},
            {room: "Supermarket", value: "15"},
            {room: "Game Store", value: "15"},
            {room: "Electric Store", value: "9"},
            {room: "Music & Sports Store", value: "9"},
        ]
    },
    {
        type: "General Industry", children: [
            {room: "Storage", value: "5"},
            {room: "Roughwork Area", value: "7"},
            {room: "Midwork Area", value: "15"},
            {room: "Finework Area", value: "25"},
            {room: "Super-finework Area", value: "50"},
            {room: "Coloring Check", value: "20"}
        ]
    },
    {
        type: "Worship Place", children: [
            {room: "Mosque", value: "10"},
            {room: "Church", value: "13"},
            {room: "Monastery", value: "10"},
        ]
    },

]

export const heatLoad = [
    {
        type: "Window", load: [
            { orientation: "North", value: 800 },
            { orientation: "South", value: 400 },
            { orientation: "East", value: 900 },
            { orientation: "West", value: 1000 },
            { orientation: "North East", value: 850 },
            { orientation: "South East", value: 650 },
            { orientation: "North West", value: 900 },
            { orientation: "South West", value: 700 }
        ]
    },
    {
        type: "Wall", load: [
            { orientation: "North", value: "2.15 (to-ti)" },
            { orientation: "South", value: "2.15 (to-ti)" },
            { orientation: "East", value: "2.15 (to-ti)" },
            { orientation: "West", value: "2.16 (to-ti)" },
            { orientation: "Roof", value: "11.5 (to-ti)" }
        ]
    }
]

export const powerFactor = [
    { number: 2, power: 0.85 },
    { number: 3, power: 0.77 },
    { number: 4, power: 0.72 },
    { number: 5, power: 0.67 },
    { number: 6, power: 0.63 },
    { number: 7, power: 0.59 },
    { number: 10, power: 0.52 },
    { number: 15, power: 0.44 },
    { number: 20, power: 0.40 },
    { number: 25, power: 0.35 }
]

export const visualComfort = [
    { locActivity: "Public entrance halls, foyers", e: 200 },
    { locActivity: "Public passageways, stairs", e: 100 },
    { locActivity: "Restaurant: bars, tables", e: 150 },
    { locActivity: "Retailing: sales areas, displays", e: 500 },
    { locActivity: "Office: general", e: 500 },
    { locActivity: "Office: workstations", e: 300 },
    { locActivity: "Office: drawing boards, fine work", e: 750 },
    { locActivity: "Workplace: fine work", e: 1000 },
    { locActivity: "Workplace: medium work", e: 300 },
    { locActivity: "Workplace: casual work", e: 200 },
    { locActivity: "Education: general classrooms", e: 300 },
    { locActivity: "Education: display boards", e: 500 },
    { locActivity: "Home: kitchens, study areas", e: 300 },
    { locActivity: "Home: halls, landings", e: 150 },
]