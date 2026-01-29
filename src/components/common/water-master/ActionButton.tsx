/**
 * Reusable Action Button Component
 * Provides consistent button styling with proper accessibility
 */

import { Button } from "@/components/common/water-master/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/components/common/water-master/utils";

interface ActionButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  showLabelOnMobile?: boolean;
  title?: string;
  disabled?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary hover:bg-primary-dark text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  warning: "bg-orange-500 hover:bg-orange-600 text-white",
  ghost: "hover:bg-gray-100 text-gray-700",
};

const sizeStyles = {
  sm: {
    button: "h-8 px-3",
    icon: "h-3.5 w-3.5",
    text: "text-xs",
  },
  md: {
    button: "h-10 px-4",
    icon: "h-4 w-4",
    text: "text-sm",
  },
  lg: {
    button: "h-12 px-6",
    icon: "h-5 w-5",
    text: "text-base",
  },
};

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  size = "sm",
  showLabelOnMobile = false,
  title,
  disabled = false,
  className,
}: ActionButtonProps) {
  const styles = sizeStyles[size];

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={cn(
        styles.button,
        styles.text,
        variantStyles[variant],
        "shadow-md hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      <Icon className={cn(styles.icon, label && "mr-2")} />
      {label && (
        <span className={showLabelOnMobile ? "" : "hidden lg:inline"}>
          {label}
        </span>
      )}
    </Button>
  );
}
