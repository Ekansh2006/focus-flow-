const primaryColor = "#4A90E2"; // Soft blue
const secondaryColor = "#50E3C2"; // Calming teal
const accentColor = "#9B59B6"; // Gentle purple
const backgroundColor = "#FFFFFF"; // Clean white
const darkTextColor = "#1A2A3A"; // Deep navy
const lightTextColor = "#8A9AA9"; // Soft gray
const errorColor = "#E74C3C"; // Soft red
const successColor = "#2ECC71"; // Soft green
const warningColor = "#F39C12"; // Soft orange

export default {
  light: {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: backgroundColor,
    card: "#F8F9FA",
    text: darkTextColor,
    subtext: lightTextColor,
    border: "#E1E8ED",
    error: errorColor,
    success: successColor,
    warning: warningColor,
    tabIconDefault: lightTextColor,
    tabIconSelected: primaryColor,
  },
  dark: {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: "#121212",
    card: "#1E1E1E",
    text: "#F8F9FA",
    subtext: "#A0AEC0",
    border: "#2D3748",
    error: errorColor,
    success: successColor,
    warning: warningColor,
    tabIconDefault: "#A0AEC0",
    tabIconSelected: primaryColor,
  }
};