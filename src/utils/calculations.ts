import { Driver, BadgeType } from "@/types/driver";

export function calculateEfficiency(distance: number, energyUsed: number): number {
  if (energyUsed <= 0) return 0;
  
  const efficiency = distance / energyUsed; // km/kWh - this is the actual efficiency
  
  console.log(`Calculating efficiency: ${distance}km / ${energyUsed}kWh = ${efficiency.toFixed(2)} km/kWh`);
  
  return Math.round(efficiency * 100) / 100; // Round to 2 decimal places
}

export function calculateNormalizedEfficiency(drivers: Driver[]): Driver[] {
  if (drivers.length === 0) return drivers;
  
  // Get all efficiency scores
  const efficiencyScores = drivers.map(driver => driver.efficiency);
  const minEfficiency = Math.min(...efficiencyScores);
  const maxEfficiency = Math.max(...efficiencyScores);
  
  // Avoid division by zero
  const range = maxEfficiency - minEfficiency;
  if (range === 0) {
    // If all efficiencies are the same, set normalized score to 50
    return drivers.map(driver => ({
      ...driver,
      normalizedEfficiency: 50
    }));
  }
  
  // Normalize to 10-100 scale (minimum score of 10 for worst performer)
  return drivers.map(driver => ({
    ...driver,
    normalizedEfficiency: Math.round(((driver.efficiency - minEfficiency) / range) * 90) + 10
  }));
}

export function getBadgeType(normalizedEfficiency: number): BadgeType {
  console.log(`Determining badge for normalized efficiency: ${normalizedEfficiency}`);
  
  if (normalizedEfficiency >= 80) {
    console.log("Badge: Energy Saver (>=80)");
    return "Energy Saver";
  }
  if (normalizedEfficiency >= 50) {
    console.log("Badge: Eco Driver (50-79)");
    return "Eco Driver";
  }
  console.log("Badge: Needs Improvement (<50)");
  return "Needs Improvement";
}

export function processDriverData(
  name: string,
  vehicle: string,
  distance: number,
  energyUsed: number,
  existingDrivers: Driver[] = []
): Omit<Driver, 'id'> {
  const efficiency = calculateEfficiency(distance, energyUsed);
  
  // Create temporary driver for normalization calculation
  const tempDriver: Driver = {
    id: 'temp',
    name,
    vehicle,
    distance,
    energyUsed,
    efficiency,
    normalizedEfficiency: 0, // Will be calculated
    badge: 'Needs Improvement' // Will be recalculated
  };
  
  // Calculate normalized efficiency with existing drivers + new driver
  const allDrivers = [...existingDrivers, tempDriver];
  const normalizedDrivers = calculateNormalizedEfficiency(allDrivers);
  const normalizedDriver = normalizedDrivers[normalizedDrivers.length - 1]; // Get the last one (our new driver)
  
  const badge = getBadgeType(normalizedDriver.normalizedEfficiency);
  
  return {
    name,
    vehicle,
    distance,
    energyUsed,
    efficiency,
    normalizedEfficiency: normalizedDriver.normalizedEfficiency,
    badge,
  };
}