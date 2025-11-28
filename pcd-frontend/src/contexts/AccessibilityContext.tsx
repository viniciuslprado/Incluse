import React, { createContext, useState, useEffect } from "react";

export type FontSize = "normal" | "large" | "extra-large";
export type FontFamily = "default" | "readable" | "serif";
export type Theme = "light" | "dark";
export type MotionPreference = "normal" | "reduced";

interface AccessibilitySettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  theme: Theme;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  fontFamily: "default", 
  theme: "light",
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

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
    
  // Limpar classes anteriores
    
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
  root.classList.remove('light', 'dark');
  root.classList.add(settings.theme);
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
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
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
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export { AccessibilityContext };
export { AccessibilityContext };