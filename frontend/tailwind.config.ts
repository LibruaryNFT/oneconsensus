import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0 0% 6%)",
        foreground: "hsl(0 0% 98%)",
        card: "hsl(0 0% 10%)",
        "card-foreground": "hsl(0 0% 98%)",
        primary: "hsl(45 97% 54%)",
        "primary-foreground": "hsl(0 0% 6%)",
        "primary-dark": "hsl(38 92% 50%)",
        accent: "hsl(280 85% 65%)",
        "accent-dark": "hsl(280 85% 55%)",
        secondary: "hsl(280 85% 65%)",
        "secondary-foreground": "hsl(0 0% 6%)",
        muted: "hsl(0 0% 30%)",
        "muted-foreground": "hsl(0 0% 70%)",
        border: "hsl(0 0% 15%)",
        input: "hsl(0 0% 11%)",
        ring: "hsl(45 97% 54%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
