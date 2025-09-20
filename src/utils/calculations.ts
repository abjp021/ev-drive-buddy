import { Driver, BadgeType } from "@/types/driver";

const SCALING_FACTOR = 10; // Adjust this to scale scores appropriately
const MAX_SCORE = 100;

export function calculateEfficiency(distance: number, energyUsed: number): number {
  if (energyUsed <= 0) return 0;
  
  const efficiency = (distance / energyUsed) * SCALING_FACTOR;
  return Math.min(efficiency, MAX_SCORE);
}

export function getBadgeType(efficiency: number): BadgeType {
  const actualEfficiency = efficiency / SCALING_FACTOR; // Convert back to km/kWh
  
  if (actualEfficiency >= 8) return "Energy Saver";
  if (actualEfficiency >= 5) return "Eco Driver";
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