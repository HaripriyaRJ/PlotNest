/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
                display: ["Roboto", "sans-serif"],
                roboto: ["Roboto", "sans-serif"],
            },
            colors: {
                primary: "#d4af35",
                "background-light": "#f8f7f6",
                "background-dark": "#1a1814",
                "surface-dark": "#2a2720",
            },
        },
    },
    plugins: [],
}