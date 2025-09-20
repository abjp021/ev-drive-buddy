import { Driver, BadgeType } from "@/types/driver";

const MAX_EFFICIENCY = 10; // Max km/kWh efficiency score

export function calculateEfficiency(distance: number, energyUsed: number): number {
  if (energyUsed <= 0) return 0;
  
  const efficiency = distance / energyUsed; // km/kWh
  const cappedEfficiency = Math.min(efficiency, MAX_EFFICIENCY);
  
  console.log(`Calculating efficiency: ${distance}km / ${energyUsed}kWh = ${efficiency} km/kWh, capped at ${cappedEfficiency}`);
  
  return cappedEfficiency;
}

export function getBadgeType(efficiency: number): BadgeType {
  console.log(`Determining badge for efficiency: ${efficiency} km/kWh`);
  
  if (efficiency >= 8) {
    console.log("Badge: Energy Saver (>=8 km/kWh)");
    return "Energy Saver";
  }
  if (efficiency >= 5) {
    console.log("Badge: Eco Driver (>=5 km/kWh)");
    return "Eco Driver";
  }
  console.log("Badge: Needs Improvement (<5 km/kWh)");
  return "Needs Improvement";
}

export function processDriverData(
  name: string,
  vehicle: string,
  distance: number,
  energyUsed: number
): Omit<Driver, 'id'> {
  const efficiency = calculateEfficiency(distance, energyUsed);
  const badge = getBadgeType(efficiency);
  
  return {
    name,
    vehicle,
    distance,
    energyUsed,
    efficiency,
    badge,
  };
}