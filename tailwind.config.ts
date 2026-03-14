import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10243E",
        mist: "#F5F8FB",
        line: "#D6E1EB",
        accent: "#0E7490",
        accentSoft: "#D9F2F7",
        success: "#0F766E",
        warn: "#C2410C",
      },
      boxShadow: {
        card: "0 14px 40px rgba(16, 36, 62, 0.08)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
