import React, { createContext, useState, useEffect } from "react";

export type FontSize = "normal" | "large" | "extra-large";
export type FontFamily = "default" | "readable" | "serif";
export type Theme = "light" | "dark" | "high-contrast";
export type MotionPreference = "normal" | "reduced";

interface AccessibilitySettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: Theme;
  reducedMotion: boolean;
  highContrast: boolean;
  focusIndicators: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleFocusIndicators: () => void;
  toggleScreenReaderOptimized: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  fontFamily: "default", 
  theme: "light",
  reducedMotion: false,
  highContrast: false,
  focusIndicators: true,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn("Erro ao carregar configurações de acessibilidade:", error);
      }
    }
  }, []);

  // Salvar configurações no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    console.log('Aplicando configurações de acessibilidade:', settings);
    
    // Limpar classes anteriores
    root.classList.remove('reduce-motion', 'high-contrast', 'focus-indicators', 'screen-reader-optimized');
    
    // Aplicar tamanho da fonte
    switch (settings.fontSize) {
      case "normal":
        root.style.fontSize = "16px";
        break;
      case "large":
        root.style.fontSize = "18px";
        break;
      case "extra-large":
        root.style.fontSize = "20px";
        break;
    }

    // Aplicar família da fonte
    switch (settings.fontFamily) {
      case "default":
        root.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        break;
      case "readable":
        root.style.fontFamily = "'Arial', 'Helvetica Neue', Helvetica, sans-serif";
        break;
      case "serif":
        root.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
        break;
    }

    // Aplicar tema
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(settings.theme);
    
    // Aplicar motion preference usando classes Tailwind dinâmicas
    if (settings.reducedMotion) {
      // Desabilitar animações Tailwind
      const animatedElements = document.querySelectorAll('.animate-bounce, .animate-spin, .animate-pulse, .animate-ping');
      animatedElements.forEach(el => {
        el.classList.add('!animate-none');
      });
      // Adicionar classe para controle via CSS
      root.setAttribute('data-reduce-motion', 'true');
    } else {
      const animatedElements = document.querySelectorAll('.animate-bounce, .animate-spin, .animate-pulse, .animate-ping');
      animatedElements.forEach(el => {
        el.classList.remove('!animate-none');
      });
      root.removeAttribute('data-reduce-motion');
    }
    
    // Aplicar alto contraste usando CSS filters
    if (settings.highContrast) {
      root.style.filter = 'contrast(150%) brightness(110%)';
      root.setAttribute('data-high-contrast', 'true');
      
      // Aplicar bordas mais visíveis usando classes Tailwind
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        el.classList.add('!border-2', '!border-black');
      });
    } else {
      root.style.filter = '';
      root.removeAttribute('data-high-contrast');
      
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        el.classList.remove('!border-2', '!border-black');
      });
    }
    
    // Aplicar focus indicators melhorados
    if (settings.focusIndicators) {
      root.setAttribute('data-enhanced-focus', 'true');
      
      // Adicionar event listeners para focus melhorado
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
          el.classList.add('!ring-4', '!ring-orange-500', '!ring-offset-4', '!scale-105', '!transition-transform');
        });
        el.addEventListener('blur', () => {
          el.classList.remove('!ring-4', '!ring-orange-500', '!ring-offset-4', '!scale-105', '!transition-transform');
        });
      });
    } else {
      root.removeAttribute('data-enhanced-focus');
      
      // Remover event listeners existentes (simplificado)
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      focusableElements.forEach(el => {
        el.classList.remove('!ring-4', '!ring-orange-500', '!ring-offset-4', '!scale-105', '!transition-transform');
      });
    }
    
    // Aplicar otimização para leitores de tela
    if (settings.screenReaderOptimized) {
      root.setAttribute('data-screen-reader-optimized', 'true');
      
      // Aumentar áreas de clique usando Tailwind
      const clickableElements = document.querySelectorAll('button, a');
      clickableElements.forEach(el => {
        el.classList.add('!min-h-[44px]', '!min-w-[44px]', '!p-3');
      });
    } else {
      root.removeAttribute('data-screen-reader-optimized');
      
      const clickableElements = document.querySelectorAll('button, a');
      clickableElements.forEach(el => {
        el.classList.remove('!min-h-[44px]', '!min-w-[44px]', '!p-3');
      });
    }
    
    console.log('Classes aplicadas:', root.className);
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const setFontFamily = (fontFamily: FontFamily) => {
    setSettings(prev => ({ ...prev, fontFamily }));
  };

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'high-contrast' : 'light'
    }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleFocusIndicators = () => {
    setSettings(prev => ({ ...prev, focusIndicators: !prev.focusIndicators }));
  };

  const toggleScreenReaderOptimized = () => {
    setSettings(prev => ({ ...prev, screenReaderOptimized: !prev.screenReaderOptimized }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setFontSize,
        setFontFamily, 
        setTheme,
        toggleTheme,
        toggleReducedMotion,
        toggleHighContrast,
        toggleFocusIndicators,
        toggleScreenReaderOptimized,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook movido para arquivo separado - hooks/useAccessibility.ts
export { AccessibilityContext };