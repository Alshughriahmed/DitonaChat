/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /grid-cols-[1-9]|grid-cols-[1-2][0-9]/ },
    { pattern: /md:grid-cols-[1-9]|md:grid-cols-[1-2][0-9]/ },
    { pattern: /grid-rows-[1-9]/ },
    "place-items-center",
    "gap-2",
    "md:gap-3",
  ],
  theme: { extend: {} },
  plugins: [],
};
