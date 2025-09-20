import { BadgeType } from "@/types/driver";
import { Zap, Leaf, AlertTriangle } from "lucide-react";

interface BadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
}

const badgeConfigs = {
  "Energy Saver": {
    icon: Zap,
    className: "bg-eco-green text-white",
    textColor: "text-eco-green",
  },
  "Eco Driver": {
    icon: Leaf,
    className: "bg-energy-amber text-white",
    textColor: "text-energy-amber",
  },
  "Needs Improvement": {
    icon: AlertTriangle,
    className: "bg-needs-red text-white",
    textColor: "text-needs-red",
  },
};

export function Badge({ type, size = "md" }: BadgeProps) {
  const config = badgeConfigs[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} />
      {type}
    </div>
  );
}

export function BadgeIcon({ type, size = 16 }: { type: BadgeType; size?: number }) {
  const config = badgeConfigs[type];
  const Icon = config.icon;
  
  return <Icon size={size} className={config.textColor} />;
}