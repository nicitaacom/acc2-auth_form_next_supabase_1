import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{tsx,mdx}"],

  theme: {
    fontFamily: {
      primary: ["Inter", "sans-serif"],
      secondary: ["Proxima Nova", "sans-serif"],
    },
    screens: {
      mobile: "415px",
      // => @media (min-width: 415px) { ... }
      tablet: "768px",
      // => @media (min-width: 768px) { ... }
      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }
      desktop: "1440px",
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      colors: {
        brand: "hsl(var(--brand) / 1)",
        background: "hsl(var(--background) / 1)",
        foreground: "hsl(var(--foreground) / 1)",
        title: "hsl(var(--title) / 1)",
        "title-foreground": "hsl(var(--title-foreground) / 1)",
        subTitle: "hsl(var(--subTitle) / 1)",

        /* The same colors */
        "border-color": "hsl(var(--border-color) / 1)" /*subTitle*/,
        "icon-color": "hsl(var(--icon-color) / 1)" /* title */,

        /* Support colors */
        info: "hsl(var(--info) / 1)",
        danger: "hsl(var(--danger) / 1)",
        warning: "hsl(var(--warning) / 1)",
        success: "hsl(var(--success) / 1)",
      },
    },
  },
  plugins: [],
}
export default config
