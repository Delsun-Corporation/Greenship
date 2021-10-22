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

export function calcWWR(collectionWindowArea, collectionWallArea) {
    const totalWindowArea = sumValue(collectionWindowArea);
    const totalWallArea = sumValue(collectionWallArea);
    return Math.ceil((totalWindowArea / totalWallArea) * 100 / 100)
}

function sumValue(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += parseInt(array[i]);
    }
    return sum
}