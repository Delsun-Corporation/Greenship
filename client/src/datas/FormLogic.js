/// 1a10
export function calcOperatingHoursPerYear(operationalHours, workingDays) {
    return (operationalHours * workingDays)
}

/// 1a11
export function calcNonOperatingHoursPerYear(operationalHours, workingDays, holidays) {
    return (((24 - operationalHours) * workingDays) + (24 * holidays))
}

/// 1a6
export function calcOccupancy(gfa, occupancyDensity) {
    return Math.ceil((gfa * occupancyDensity))
}

/// 1b1
export function calcRoomVolumePerPerson(floorNumber, avgFloorHeight, occupancyDensity) {
    return Math.ceil(floorNumber * avgFloorHeight / occupancyDensity)
}

/// 2
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

/// 3a2
export function calcNonDaylightArea(gfa, daylightArea) {
    return Math.ceil(gfa - daylightArea)
}

/// 3a5
export function calcLeDuringOperationalDay(daylightArea, lpdOperational, operationalHours) {
    return Math.ceil(daylightArea * operationalHours * lpdOperational)
}

/// 3a6
export function calcLeDuringOperationalNonDay(gfa, daylightArea, lpdOperational, operationalHours) {
    return Math.ceil((gfa - daylightArea) * operationalHours * lpdOperational)
}

/// 3a7
export function calcLeDuringNonOperational(gfa, operationalHours, workingDays, holidays, lpdNonOperational) {
    return Math.ceil(gfa * calcNonOperatingHoursPerYear(operationalHours, workingDays, holidays) * lpdNonOperational)
}

/// 3b
export function calcBSL(windowAreas, wallAreas, windowHeatLoad, wallHeatLoad, toTi) {
    var totalAreaHeatLoad = 0
    windowAreas.forEach((element, index) => {
        totalAreaHeatLoad += element * windowHeatLoad[index].value
    });
    wallAreas.forEach((element, index) => {
        totalAreaHeatLoad += element * parseFloat(wallHeatLoad[index].value) * toTi
    });

    return Math.ceil(totalAreaHeatLoad * toTi)
}

export function calcPSL(gfa, occupancyDensity) {
    return Math.ceil(200 * calcOccupancy(gfa, occupancyDensity))
}

export function calcPLL(gfa, occupancyDensity) {
    return Math.ceil(250 * calcOccupancy(gfa, occupancyDensity))
}

export function calcLSL(gfa, totalLpdOperational, totalLpdNonOperational) {
    return Math.ceil((totalLpdOperational + totalLpdNonOperational) * gfa * 1.25 * 3.4)
} 

export function calcCFM1(ach, gfa, floorCount, floorHeightAvg) {
    return Math.ceil(ach * gfa * floorCount * floorHeightAvg * 35.31 / 60)
}

export function calcCFM2(toTi, ach, gfa, floorCount, floorHeightAvg) {
    const cfm1 = calcCFM1(ach, gfa, floorCount, floorHeightAvg)
    return Math.ceil(cfm1 * ((toTi * 1.08) + (0.15 * 0.67)))
}

export function convertCoolingLoad(coolingLoad, operationalHours, workingDays, gfa) {
    return Math.ceil(coolingLoad / 12000 * 1.12 * operationalHours * workingDays / gfa)
}

/// 3c
export function calcApplianceConsumption(amount, watt, operationalHours) {
    return Math.ceil(amount * watt * operationalHours)
}