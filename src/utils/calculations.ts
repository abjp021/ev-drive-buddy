import { Driver, BadgeType } from "@/types/driver";

const SCALING_FACTOR = 10; // Scale to get realistic efficiency scores
const MAX_EFFICIENCY = 10; // Max efficiency score after scaling

export function calculateEfficiency(distance: number, energyUsed: number): number {
  if (energyUsed <= 0) return 0;
  
  const rawEfficiency = distance / energyUsed; // km/kWh
  const scaledEfficiency = rawEfficiency * SCALING_FACTOR; // Apply scaling
  const cappedEfficiency = Math.min(scaledEfficiency, MAX_EFFICIENCY);
  
  console.log(`Calculating efficiency: ${distance}km / ${energyUsed}kWh = ${rawEfficiency} km/kWh`);
  console.log(`After scaling (×${SCALING_FACTOR}): ${scaledEfficiency}, capped at ${cappedEfficiency}`);
  
  return cappedEfficiency;
}

export function getBadgeType(efficiency: number): BadgeType {
  console.log(`Determining badge for scaled efficiency: ${efficiency}`);
  
  if (efficiency >= 8) {
    console.log("Badge: Energy Saver (>=8)");
    return "Energy Saver";
  }
  if (efficiency >= 5) {
    console.log("Badge: Eco Driver (>=5)");
    return "Eco Driver";
  }
  console.log("Badge: Needs Improvement (<5)");
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