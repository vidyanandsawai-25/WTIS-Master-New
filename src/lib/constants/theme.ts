/**
 * Application Theme Configuration
 * Centralized styling tokens to replace magic values
 */

export const theme = {
  colors: {
    // Primary Brand Colors
    primary: {
      DEFAULT: "#005A9C",
      light: "#0077CC",
      dark: "#004080",
    },
    // Status Colors
    status: {
      success: "#2E7D32",
      warning: "#F7B500",
      error: "#DC2626",
      info: "#0284C7",
    },
    // UI Colors
    ui: {
      border: "#D9DEE4",
      text: "#333333",
      tableHeader: "#E9F1FA",
    },
  },
  spacing: {
    // Consistent component spacing
    card: {
      padding: "1rem",      // 4
      gap: "0.75rem",       // 3
    },
    button: {
      sm: "0.5rem 0.75rem", // px-3 py-2
      md: "0.625rem 1rem",  // px-4 py-2.5
      lg: "0.75rem 1.5rem", // px-6 py-3
    },
    table: {
      cellPadding: "0.5rem",
      headerPadding: "0.625rem",
    },
  },
  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    cardHover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  gradients: {
    primary: "linear-gradient(135deg, #005A9C 0%, #0077CC 100%)",
    card: "linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)",
  },
} as const;

// Tailwind utility classes for common patterns
export const buttonStyles = {
  primary: "bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg transition-all duration-200",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200",
  success: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200",
  ghost: "hover:bg-gray-100 text-gray-700 transition-colors duration-200",
};

export const cardStyles = {
  base: "bg-white rounded-lg shadow-card hover:shadow-cardHover transition-shadow duration-200",
  stat: "bg-gradient-to-br text-white rounded-xl p-4 shadow-lg ring-2 transition-all duration-300",
};

export const tableStyles = {
  header: "bg-gradient-to-r from-primary to-primary-light text-white",
  row: "hover:bg-blue-50 transition-colors duration-150",
  cell: "px-2 py-2 text-xs text-gray-700",
};
