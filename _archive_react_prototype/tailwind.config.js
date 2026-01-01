/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    DEFAULT: '#0f172a',
                    bg: '#0f172a',
                    lighter: '#1e293b',
                    card: '#1e293b',
                },
                primary: {
                    DEFAULT: '#3b82f6',
                    500: '#3b82f6',
                    600: '#2563eb',
                }
            },
        },
    },
    plugins: [],
}
