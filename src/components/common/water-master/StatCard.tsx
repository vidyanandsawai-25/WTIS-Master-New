/**
 * Reusable Statistics Card Component
 * Clean, maintainable stat display without hardcoded styles
 */

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  colorScheme: "blue" | "green" | "orange" | "purple";
  index: number;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    hover: "hover:from-blue-600 hover:to-blue-700",
    ring: "ring-blue-100",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    hover: "hover:from-green-600 hover:to-green-700",
    ring: "ring-green-100",
  },
  orange: {
    gradient: "from-orange-500 to-orange-600",
    hover: "hover:from-orange-600 hover:to-orange-700",
    ring: "ring-orange-100",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    hover: "hover:from-purple-600 hover:to-purple-700",
    ring: "ring-purple-100",
  },
};

export function StatCard({ icon: Icon, label, value, colorScheme, index, onClick }: StatCardProps) {
  const colors = colorClasses[colorScheme];
  const isClickable = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`
        bg-gradient-to-br ${colors.gradient} ${isClickable ? colors.hover : ""}
        text-white rounded-xl p-4 shadow-lg ring-2 ${colors.ring}
        transition-all duration-300
        ${isClickable ? "cursor-pointer transform hover:scale-105" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
