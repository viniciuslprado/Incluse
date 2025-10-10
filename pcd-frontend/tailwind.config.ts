/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,ts,tsx}"],
  darkMode: 'class', // Habilita modo escuro baseado em classe CSS
  theme: { 
    extend: {
      colors: {
        // Cores personalizadas que se adaptam ao tema
        primary: {
          light: '#3b82f6', // azul claro
          dark: '#60a5fa',  // azul mais claro para modo escuro
        },
        background: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        surface: {
          light: '#f9fafb',
          dark: '#374151',
        },
        text: {
          light: '#111827',
          dark: '#f9fafb',
        }
      }
    } 
  },
  plugins: [],
};
