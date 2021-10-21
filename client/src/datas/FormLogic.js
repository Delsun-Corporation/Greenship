export function calcOperatingHoursPerYear(operationalHours, workingDays) {
    return (operationalHours * workingDays)
}

export function calcNonOperatingHoursPerYear(operationalHours, workingDays, holidays) {
    return (((24 - operationalHours) * workingDays) + (24 * holidays))
}

export function calcOccupancy(gfa, occupancyDensity) {
    return Math.ceil((gfa * occupancyDensity))
}

export function calcRoomVolumePerPerson(floorNumber, avgFloorHeight, occupancyDensity) {
    return Math.ceil(floorNumber * avgFloorHeight / occupancyDensity)
}

export function calcWWR(windowAreaP, windowAreaL, wallAreaP, wallAreaL) {
    return Math.ceil((windowAreaP * windowAreaL) / (wallAreaP * wallAreaL) * 100 / 100)
}