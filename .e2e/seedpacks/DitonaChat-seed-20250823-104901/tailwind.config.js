/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  safelist: [
    "grid-rows-2",
    "grid-cols-5",
    "md:grid-cols-6",
    "place-items-center",
    "gap-2",
    "md:gap-3",
  ],
  plugins: [],
};
