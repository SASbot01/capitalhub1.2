export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Capital HUB Brand Colors
        carbon: "#0F0F12",        // Negro Carbón - bg-primary
        panel: "#1A1C20",         // Panel Background - bg-secondary
        graphite: "#2A2D34",      // Gris Grafito - bg-tertiary / borders
        offwhite: "#F5F6F7",      // Blanco Roto - text-main
        muted: "#6B6F76",         // Gris Técnico - text-muted
        accent: "#5B4B8A",        // Púrpura Técnico
        "accent-glow": "rgba(91, 75, 138, 0.2)",

        // Legacy support
        appleGray: "#f5f5f7",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        logo: "0.35em",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(91, 75, 138, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
