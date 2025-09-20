export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  distance: number;
  energyUsed: number;
  efficiency: number;
  badge: BadgeType;
}

export type BadgeType = "Energy Saver" | "Eco Driver" | "Needs Improvement";

export interface BadgeConfig {
  type: BadgeType;
  minEfficiency: number;
  maxEfficiency?: number;
  color: string;
  bgColor: string;
  icon: string;
}