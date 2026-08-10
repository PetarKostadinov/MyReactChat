import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#0891b2",
      600: "#0e7490",
      700: "#155e75",
      800: "#164e63",
      900: "#083344",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  radii: { lg: "0.875rem", xl: "1.125rem" },
  shadows: { panel: "0 12px 32px rgba(15, 23, 42, 0.10)" },
  styles: {
    global: {
      body: { bg: "gray.50", color: "gray.800" },
      "::selection": { bg: "brand.100", color: "brand.900" },
    },
  },
  components: {
    Button: { defaultProps: { colorScheme: "brand" }, baseStyle: { borderRadius: "lg" } },
    Input: { defaultProps: { focusBorderColor: "brand.500" } },
  },
});

export default theme;
