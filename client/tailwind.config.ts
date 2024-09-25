import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/[object Object].js",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Sans-Mono", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "success-cta": {
          "50": "#eafff8",
          "100": "#cdfeec",
          "200": "#a0fadd",
          "300": "#63f2cc",
          "400": "#25e2b6",
          "500": "#00b793",
          "600": "#00a484",
          "700": "#00836e",
          "800": "#006758",
          "900": "#005549",
          "950": "#00302a",
        },
        error: {
          "50": "#fef3f2",
          "100": "#ffe4e1",
          "200": "#ffcec8",
          "300": "#ffaca2",
          "400": "#fc7c6d",
          "500": "#f4523f",
          "600": "#e13521",
          "700": "#be2917",
          "800": "#9d2517",
          "900": "#82251a",
          "950": "#470f08",
        },
      },
    },
  },
  plugins: [nextui()],
};
export default config;
