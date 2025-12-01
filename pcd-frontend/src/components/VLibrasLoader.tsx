// Declaração global para o VLibras no window
declare global {
  interface Window {
    VLibras?: any;
  }
}
import { useEffect } from "react";

export default function VLibrasLoader() {
  useEffect(() => {
    // Remove apenas o script antigo, não o widget
    const oldScript = document.getElementById("vlibras-script");
    if (oldScript) {
      oldScript.remove();
      console.log("VLibrasLoader: Script antigo removido");
    }

    // Adiciona script VLibras se não existir
    if (!document.getElementById("vlibras-script")) {
      const script = document.createElement("script");
      script.id = "vlibras-script";
      script.src = "https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@dev/app/vlibras-plugin.js";
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          try {
            if (window.VLibras) {
              new window.VLibras.Widget("https://vlibras.gov.br/app");
              console.log("VLibrasLoader: Widget VLibras inicializado (body padrão)");
            } else {
              console.warn("VLibrasLoader: window.VLibras não encontrado");
            }
          } catch (e) {
            console.error("VLibras init error", e);
          }
        }, 500);
      };
      document.body.appendChild(script);
      console.log("VLibrasLoader: Script VLibras adicionado");
    }

    // Cleanup ao desmontar: remove apenas o script, não o widget VLibras
    return () => {
      const s = document.getElementById("vlibras-script");
      if (s) s.remove();
      // Não remove o widget VLibras para evitar sumiço após navegação
      console.log("VLibrasLoader: Cleanup executado (apenas script)");
    };
  }, []);
  return null;
}
