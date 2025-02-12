/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  layers: ["base", "components", "utilities"],
  theme: {
    extend: {
      colors: {
        primary: "#B73225",
        secondary: "#004E7C",
        accent: "#283747",
      },
      fontFamily: {
        aleo: ["Aleo", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        sm: [
          "0.875rem",
          {
            lineHeight: "1.25rem",
          },
        ],
        base: [
          "1rem",
          {
            lineHeight: "1.375rem",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "2.8125rem",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "3.625rem",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "4.938rem",
          },
        ],
        h1: {
          sm: [
            "1.5rem",
            {
              lineHeight: "2.8125rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          md: [
            "1.875rem",
            {
              lineHeight: "3.625rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          lg: [
            "2.25rem",
            {
              lineHeight: "4.938rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
        },
        h2: {
          sm: [
            "1.25rem",
            {
              lineHeight: "2.5rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          md: [
            "1.5rem",
            {
              lineHeight: "3rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          lg: [
            "1.875rem",
            {
              lineHeight: "3.625rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
        },
        h3: {
          sm: [
            "0.875rem",
            {
              lineHeight: "1.5rem",
              letterSpacing: "0.00625rem",
              fontWeight: "400",
            },
          ],
          md: [
            "0.9375rem",
            {
              lineHeight: "1.75rem",
              letterSpacing: "0.00625rem",
              fontWeight: "400",
            },
          ],
          lg: [
            "1rem",
            {
              lineHeight: "1.875rem",
              letterSpacing: "0.00625rem",
              fontWeight: "400",
            },
          ],
        },
        h4: {
          sm: [
            "0.875rem",
            {
              lineHeight: "1.5rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          md: [
            "0.9375rem",
            {
              lineHeight: "1.75rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
          lg: [
            "1rem",
            {
              lineHeight: "1.875rem",
              letterSpacing: "0.0125rem",
              fontWeight: "700",
            },
          ],
        },
        h5: {
          sm: [
            "0.875rem",
            {
              lineHeight: "1.375rem",
              letterSpacing: "0.00625rem",
              fontWeight: "700",
            },
          ],
          md: [
            "0.9375rem",
            {
              lineHeight: "1.5rem",
              letterSpacing: "0.00625rem",
              fontWeight: "700",
            },
          ],
          lg: [
            "1rem",
            {
              lineHeight: "1.625rem",
              letterSpacing: "0.00625rem",
              fontWeight: "700",
            },
          ],
        },
        h6: {
          sm: [
            "0.75rem",
            {
              lineHeight: "1rem",
              letterSpacing: "0.0125rem",
              fontWeight: "600",
            },
          ],
          md: [
            "0.8125rem",
            {
              lineHeight: "1.125rem",
              letterSpacing: "0.0125rem",
              fontWeight: "600",
            },
          ],
          lg: [
            "0.875rem",
            {
              lineHeight: "1.25rem",
              letterSpacing: "0.0125rem",
              fontWeight: "600",
            },
          ],
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        marquee2: "marquee2 60s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
