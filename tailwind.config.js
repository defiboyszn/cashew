/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-gt-walsheim-pro)', ...defaultTheme.fontFamily.sans],
                "gt-black": ["gt-walsheim-black"],
                "gt-bold": ["gt-walsheim-bold"],
                "gt-light": ["gt-walsheim-light"],
                "gt-regular": ["gt-walsheim-regular"],
                "gt-medium": ["gt-walsheim-medium"],
                "gt-thin": ["gt-walsheim-thin"],
            },
            colors: {
                'primary-light': "#ECE9FC",
                'primary': '#8363EE',
                'primary-dark': '#45268F',
                'cgray-25': "#FCFCFD",
                'cgray-100': "#F2F4F7",
                'cgray-300': "#D0D5DD",
                'cgray-500': "#667085",
                "cgray-900": "#101828",
                up: "#12a633",
                down: "#c00f00"
            }
        },
    },
    plugins: [],
}
