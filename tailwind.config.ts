import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        Primary: {
          50: "#FFF6F0",
          100: "#FFD8BD",
          200: "#FFBB8A",
          300: "#FF9143",
          400: "#FF7F24",
          500: "#F06400",
          600: "#BD4B00",
          700: "#8A3500",
          800: "#572100",
          900: "#240F00"
        },
        Secondary: {
          25: "#FFF9E9",
          50: "#FFF4D1",
          100: "#FFE79E",
          200: "#FFDA6A",
          300: "#FFCD38",
          400: "#FFC105",
          500: "#D19600",
          600: "#9E6F00",
          700: "#6B4B00",
          800: "#423100",
          900: "#1A1300"
        },
        Gray: {
          50: "#F6F5F4",
          100: "#DEDCD7",
          200: "#C4C3BE",
          300: "#ABA9A5",
          400: "#91908D",
          500: "#787774",
          600: "#5E5E5B",
          700: "#454443",
          800: "#2B2B2A",
          900: "#121211"
        },
        SystemColor: {
          Red: "#E80018"
        }
      },
      fontSize: {
        "main-54": ["54px", { lineHeight: "120%", fontWeight: "400", letterSpacing: "-0.27px" }],
        "main-30": ["30px", { lineHeight: "120%", fontWeight: "400", letterSpacing: "-0.15px" }],
        "heading-32": ["32px", { lineHeight: "120%", fontWeight: "700", letterSpacing: "-0.16px" }],
        "heading-28": ["28px", { lineHeight: "120%", fontWeight: "700", letterSpacing: "-0.14px" }],
        "heading-24": ["24px", { lineHeight: "120%", fontWeight: "700", letterSpacing: "-0.12px" }],
        "heading-20": ["20px", { lineHeight: "125%", fontWeight: "700", letterSpacing: "-0.1px" }],
        "heading-18": ["18px", { lineHeight: "125%", fontWeight: "700", letterSpacing: "-0.1px" }],
        "title-24": ["24px", { lineHeight: "120%", fontWeight: "600" }],
        "title-20": ["20px", { lineHeight: "130%", fontWeight: "600" }],
        "title-18": ["18px", { lineHeight: "135%", fontWeight: "600" }],
        "title-16": ["16px", { lineHeight: "135%", fontWeight: "600" }],
        "title-14": ["14px", { lineHeight: "125%", fontWeight: "600" }],
        "title-13": ["13px", { lineHeight: "125%", fontWeight: "600" }],
        "body-20": ["20px", { lineHeight: "125%", fontWeight: "500" }],
        "body-18": ["18px", { lineHeight: "125%", fontWeight: "500" }],
        "body-16": ["16px", { lineHeight: "125%", fontWeight: "500" }],
        "body-15": ["15px", { lineHeight: "135%", fontWeight: "500" }],
        "body-14": ["14px", { lineHeight: "135%", fontWeight: "500" }],
        "body-13": ["13px", { lineHeight: "135%", fontWeight: "500" }],
        "body-12": ["12px", { lineHeight: "140%", fontWeight: "500" }],
        "caption-14": ["14px", { lineHeight: "135%", fontWeight: "300" }],
        "caption-12": ["12px", { lineHeight: "140%", fontWeight: "300" }],
        "caption-11": ["11px", { lineHeight: "135%", fontWeight: "300" }],
        "caption-10": ["10px", { lineHeight: "135%", fontWeight: "300" }],
        "r-body-18": ["18px", { lineHeight: "125%", fontWeight: "400" }],
        "r-body-16": ["16px", { lineHeight: "135%", fontWeight: "400" }],
        "r-body-14": ["14px", { lineHeight: "130%", fontWeight: "400" }],
        "r-body-13": ["13px", { lineHeight: "135%", fontWeight: "400" }]
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)", "sans-serif"],
        yangjin: ["var(--font-yangjin)", "sans-serif"],
        wiggle: ["var(--font-wiggle)", "sans-serif"]
      }
    },
    screens: {
      ssm: "375px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      xxl: "1920px"
    }
  },

  plugins: []
};
export default config;
