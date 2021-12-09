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
    return (gfa * occupancyDensity / 100)
}

/// 1b1
export function calcRoomVolumePerPerson(gfa, floorNumber, avgFloorHeight, occupancyDensity) {
    const totalOccupancy = (gfa * occupancyDensity / 100);
    return (gfa * floorNumber * avgFloorHeight / totalOccupancy)
}

/// 2
export function calcWWR(collectionWindowArea, collectionWallArea) {
    const totalWindowArea = sumValue(collectionWindowArea);
    const totalWallArea = sumValue(collectionWallArea);
    const applySeparator = numberFormat((totalWindowArea / (totalWallArea + totalWindowArea)) * 100);
    console.log("WWR", totalWindowArea, totalWallArea)
    return applySeparator;
}

function sumValue(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        
        if (!isNaN(array[i])) {
            sum += parseInt(array[i]);
        } 
    }
    return sum
}

/// 3a
export function calcLightingEnergyConsumption(leOperationalDay, leOperationalNonDay, leNonOperational, gfa) {
    return (leOperationalDay + leOperationalNonDay + leNonOperational) / gfa / 1000
}

/// 3a5
export function calcLeDuringOperationalDay(daylightArea, lpdOperational, operationalHours, workingDays) {
    return (daylightArea * calcOperatingHoursPerYear(operationalHours, workingDays) * lpdOperational)
}

/// 3a6
export function calcLeDuringOperationalNonDay(nondaylightArea, lpdOperational, operationalHours, workingDays) {
    return nondaylightArea * calcOperatingHoursPerYear(operationalHours, workingDays) * lpdOperational
}

/// 3a7
export function calcLeDuringNonOperational(gfa, operationalHours, workingDays, holidays, lpdNonOperational) {
    return (gfa * calcNonOperatingHoursPerYear(operationalHours, workingDays, holidays) * lpdNonOperational)
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

    return (totalAreaHeatLoad * toTi)
}

export function calcPSL(gfa, occupancyDensity) {
    return (200 * calcOccupancy(gfa, occupancyDensity))
}

export function calcPLL(gfa, occupancyDensity) {
    return (250 * calcOccupancy(gfa, occupancyDensity))
}

export function calcLSL(gfa, totalLpdOperational, totalLpdNonOperational) {
    return ((totalLpdOperational + totalLpdNonOperational) * gfa * 1.25 * 3.4)
}

export function calcCFM1(ach, gfa, floorCount, floorHeightAvg) {
    return (ach * gfa * floorCount * floorHeightAvg * 35.31 / 60)
}

export function calcCFM2(toTi, ach, gfa, floorCount, floorHeightAvg) {
    const cfm1 = calcCFM1(ach, gfa, floorCount, floorHeightAvg)
    return (cfm1 * ((toTi * 1.08) + (0.15 * 0.67)))
}

export function convertCoolingLoad(coolingLoad, operationalHours, workingDays, gfa) {
    return (coolingLoad / 12000 * 1.12 * operationalHours * workingDays / gfa)
}

/// 3c
export function calcApplianceConsumption(amount, watt, operationalHours, gfa) {
    return (amount * watt * operationalHours / 1000 / gfa)
}

/// 3d
export function calcLiftConsumption(gfa, operationalHours, watt, amount, capacity, velocity) {
    return (0.2 * watt * amount * ((0.75 * capacity * velocity) / 75) * 0.746 * operationalHours / gfa)
}

export function calcUtilityConsumption(gfa, operationalHours, watt, amount) {
    return (watt * amount * operationalHours / 1000 / gfa)
}

/// 3e
export function calcPlugEnergyAC(gfa, operationalHours, operatingPower) {
    return (operatingPower * operationalHours * gfa / 1000)
}

export function calcPlugEnergyNonAC(gfa, operationalHours, nonOperatingPower) {
    return (nonOperatingPower * (24 - operationalHours) * gfa / 1000)
}

export function calcPlugConsumption(gfa, plugEnergyAC, plugEnergyNonAC) {
    return ((plugEnergyAC + plugEnergyNonAC) / gfa)
}

/// 4a
export function calcZonePopulation(gfa, occupancyDensity) {
    return ((gfa * occupancyDensity)/100)
}

export function calcVbz(rp, pz, ra, az, mvAmount) {
    return ((rp * pz) + (ra * az)) / mvAmount
}

/// 4b
export function calcACH(velocity, ventilationArea, volume) {
    return ((velocity * ventilationArea * 3600) / volume)
}

/// 4c
export function calcAccessPercentage(accessArea, gfa) {
    return (accessArea / gfa * 100)
}

/// 4d
export function calcIlluminance(area, count, lumen) {
    return ((count * lumen * 0.56) / area)
}

/// 5
export function calcPotentialPV(pca, l, w) {
    return (pca / ((l * w) / 1000000)).toFixed(2);
 }
 
 export function calcPredictionElectical(potentialPv, wpeak, gfa) {
     return (potentialPv * wpeak * 4 * 365 / gfa / 1000).toFixed(2);
 }
 
 export function calcPercentageElectrical(predictialElectrical, total_dec) {
    return (predictialElectrical/total_dec * 100);
 }

export function numberFormat(value, numberOfDigits = 2) {
    if (isNaN(value)) {
        return 0
    }

    var result = new Intl.NumberFormat('en', { minimumFractionDigits: 0, maximumFractionDigits: numberOfDigits }).format(value)

    if (result) {
        return result
    }
    return 0
    
}
