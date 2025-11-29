/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Habilita modo escuro baseado em classe CSS
  theme: { 
    extend: {
      colors: {
        // Paleta Azul + Verde Inclusivo - WCAG 2.1 AA Compliant
        'incluse': {
          // Primária - Azul médio para confiança e profissionalismo
          'primary': '#0057B8',
          'primary-dark': '#004494',
          'primary-light': '#E6F0FF',
          
          // Secundária - Verde suave para inclusão e acolhimento
          'secondary': '#2E8B57',
          'secondary-dark': '#1F5F3F',
          'secondary-light': '#E8F5E9',
          
          // Acento - Azul vibrante para interações
          'accent': '#2E8BFF',
          'accent-dark': '#1976D2',
          'accent-hover': '#4FC3F7',
          
          // Texto com alto contraste
          'text': '#333333',
          'text-secondary': '#555555',
          'text-light': '#666666',
          'text-dark': '#F5F5F5',
          
          // Backgrounds
          'bg-primary': '#E6F0FF',     // Azul muito claro
          'bg-secondary': '#E8F5E9',   // Verde muito claro
          'bg-neutral': '#F5F5F5',     // Cinza claro neutro
          'bg-white': '#FFFFFF',
          'bg-dark': '#1F2937',
          
          // Estados semânticos
          'success': '#43A047',        // Verde vibrante
          'success-bg': '#E8F5E9',
          'error': '#D32F2F',          // Vermelho suave
          'error-bg': '#FFEBEE',
          'warning': '#FF8F00',
          'warning-bg': '#FFF8E1',
          'info': '#1976D2',
          'info-bg': '#E3F2FD',
          
          // Variações para modo escuro
          'primary-dark-mode': '#4FC3F7',
          'secondary-dark-mode': '#66BB6A',
          'bg-primary-dark': '#0D47A1',
          'bg-secondary-dark': '#1B5E20',
        },
        
        // Manter compatibilidade com cores existentes
        primary: {
          light: '#0057B8',
          dark: '#004494',
          DEFAULT: '#0057B8',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        surface: {
          light: '#F5F5F5',
          dark: '#374151',
        },
        text: {
          light: '#333333',
          dark: '#F5F5F5',
        }
      }
    } 
  },
  plugins: [],
};
