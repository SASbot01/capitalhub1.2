export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Capital HUB Brand Colors – Monochrome V3.0
        carbon: "#0F0F12",        // Negro Carbón - bg-primary
        panel: "#18181B",         // Panel Background - bg-secondary
        graphite: "#2A2D34",      // Gris Grafito - bg-tertiary / borders
        offwhite: "#F5F6F7",      // Blanco Roto - text-main
        muted: "#6B7280",         // Gris Técnico - text-muted
        accent: "#FFFFFF",        // Monochrome accent
        "accent-glow": "rgba(255, 255, 255, 0.08)",

        // Legacy support
        appleGray: "#f5f5f7",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        logo: "0.45em",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 255, 255, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
