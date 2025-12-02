// Declaração global para o VLibras no window
declare global {
  interface Window {
    VLibras?: any;
    __vlibras_inited?: boolean;
  }
}

import { useEffect, useState } from "react";

export default function VLibrasLoader() {
  const [open, setOpen] = useState(true);

  // Remove todos os elementos VLibras do DOM
  const removeVLibras = () => {
    // Remove script
    const s = document.getElementById("vlibras-script");
    if (s) s.remove();
    // Remove marcações
    const vws = document.querySelectorAll('[vw], [vp], [vw-plugin-wrapper], [vw-access-button], .vp-access-button, #vlibras-fallback-btn');
    vws.forEach((el) => el.remove());
    // Remove widget criado pelo plugin
    const widget = document.querySelector('.vw-plugin-wrapper');
    if (widget) widget.remove();
    // Reseta flag global
    window.__vlibras_inited = false;
    window.VLibras = undefined;
  };

  useEffect(() => {
    if (!open) {
      removeVLibras();
      return;
    }

    // Inicializa VLibras apenas uma vez e evita remover o widget
    if (window.__vlibras_inited) {
      console.log("VLibrasLoader: Já inicializado, ignorando");
      return;
    }

    const existingScript = document.getElementById("vlibras-script");
    // fontes e funções de carregamento ficam em escopo acessível para fallback/erro
    const sources = [
      "https://vlibras.gov.br/app/vlibras-plugin.js",
      "https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@dev/app/vlibras-plugin.js",
    ];
    let tried = 0;
    const loadFromSource = (src: string) => {
      return new Promise<HTMLScriptElement>((resolve, reject) => {
        const s = document.createElement("script");
        s.id = "vlibras-script";
        s.src = src;
        s.async = true;
        s.onload = () => resolve(s);
        s.onerror = (e) => reject(e || new Error("Script load error"));
        document.body.appendChild(s);
      });
    };

    const tryLoad = async () => {
      for (; tried < sources.length; tried++) {
        const src = sources[tried];
        try {
          console.log(`VLibrasLoader: tentando carregar VLibras de ${src}`);
          await loadFromSource(src);
          // dá tempo para o script inicializar internals antes de chamar init
          setTimeout(initWidget, 500);
          console.log("VLibrasLoader: Script VLibras adicionado");
          return;
        } catch (e) {
          console.warn(`VLibrasLoader: falha ao carregar de ${src}`, e);
          // remove script com mesmo id para tentar próximo
          const s = document.getElementById("vlibras-script");
          if (s) s.remove();
        }
      }
      console.error("VLibrasLoader: todas as fontes de VLibras falharam");
    };

    // Garante que a marcação mínima esperada pelo plugin exista
    const ensureMarkup = () => {
      if (document.querySelector("[vp]") || document.querySelector("[vw]")) return;
      try {
        const root = document.createElement("div");
        root.setAttribute("vw", "");
        root.style.display = "none";

        const pluginWrapper = document.createElement("div");
        pluginWrapper.setAttribute("vw-plugin-wrapper", "");

        const vp = document.createElement("div");
        vp.setAttribute("vp", "");

        const accessButton = document.createElement("div");
        accessButton.setAttribute("vw-access-button", "");

        root.appendChild(pluginWrapper);
        root.appendChild(vp);
        root.appendChild(accessButton);
        document.body.appendChild(root);
        console.log("VLibrasLoader: Marcações mínimas injetadas");
      } catch (e) {
        console.warn("VLibrasLoader: falha ao injetar marcação mínima", e);
      }
    };

    ensureMarkup();

    const initWidget = () => {
      try {
        if (window.VLibras) {
          new window.VLibras.Widget("https://vlibras.gov.br/app");
          window.__vlibras_inited = true;
          console.log("VLibrasLoader: Widget VLibras inicializado");
          // Remove o botão de fallback caso exista — o widget já criou seu botão
          const fb = document.getElementById("vlibras-fallback-btn");
          if (fb) fb.remove();
          // Tenta forçar visibilidade do botão do plugin (caso esteja oculto por CSS)
          const tryShowPluginButton = () => {
            try {
              const selectors = [
                '[vw-access-button]',
                '[vw] [vw-access-button]',
                '.vp-access-button',
                '[vw-plugin-wrapper] [vw-access-button]',
              ];
              let button: HTMLElement | null = null;
              for (const sel of selectors) {
                const el = document.querySelector(sel) as HTMLElement | null;
                if (el) {
                  button = el;
                  break;
                }
              }

              const wrapper = document.querySelector('[vw-plugin-wrapper]') as HTMLElement | null;

              if (button) {
                button.style.display = 'flex';
                button.style.visibility = 'visible';
                button.style.opacity = '1';
                button.style.zIndex = '2147483647';
                try { button.style.position = 'fixed'; } catch {}
                try { button.style.right = '16px'; } catch {}
                try { button.style.bottom = '330px'; } catch {}
                try { button.classList.add('active'); } catch {}
                // simula clique para abrir o widget caso necessário
                try { (button as HTMLElement).click(); } catch (e) { /* ignore */ }
              }

              if (wrapper) {
                wrapper.style.display = 'block';
                wrapper.style.visibility = 'visible';
                wrapper.style.zIndex = '2147483646';
              }
              console.log('VLibrasLoader: tentativa de exibir botão do plugin executada');
            } catch (e) {
              console.warn('VLibrasLoader: erro ao tentar exibir botão do plugin', e);
            }
          };

          // Tenta imediatamente e mais algumas vezes se o elemento ainda não existir
          tryShowPluginButton();
          const retryInterval = setInterval(() => {
            if (!window.__vlibras_inited) return;
            tryShowPluginButton();
          }, 800);
          setTimeout(() => clearInterval(retryInterval), 6000);
        } else {
          console.warn("VLibrasLoader: window.VLibras não encontrado no onload");
        }
      } catch (e) {
        console.error("VLibras init error", e);
      }
    };

    if (existingScript) {
      if (window.VLibras) {
        initWidget();
      } else {
        existingScript.addEventListener("load", initWidget);
      }
    } else {
      tryLoad();
    }

    // Cria um botão de fallback visível caso o widget não crie o botão sozinho
    const createFallbackButton = () => {
      if (document.getElementById("vlibras-fallback-btn")) return;
      try {
        const btn = document.createElement("button");
        btn.id = "vlibras-fallback-btn";
        btn.title = "Abrir VLibras";
        btn.setAttribute("aria-label", "Abrir VLibras");
        btn.style.position = "fixed";
        btn.style.right = "16px";
        btn.style.bottom = "330px";
        btn.style.width = "48px";
        btn.style.height = "48px";
        btn.style.borderRadius = "8px";
        btn.style.border = "none";
        btn.style.background = "#0ea5a4";
        btn.style.color = "white";
        btn.style.zIndex = "2147483647";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
        btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        btn.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#047481"/>
            <path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        btn.addEventListener("click", () => {
          if (window.__vlibras_inited && window.VLibras) {
            try {
              // tenta abrir widget caso a API ofereça
              if ((window as any).plugin && (window as any).plugin.element) {
                const ev = new CustomEvent("vp-widget-open");
                window.dispatchEvent(ev);
              }
            } catch (e) {
              console.warn("VLibrasLoader: falha ao abrir widget via plugin", e);
            }
            return;
          }
          // tenta forçar carregamento/initialização
          ensureMarkup();
          // Re-tenta carregar se ainda não inicializado
          const s = document.getElementById("vlibras-script");
          if (!s) tryLoad();
        });
        document.body.appendChild(btn);
      } catch (e) {
        console.warn("VLibrasLoader: falha ao criar botão de fallback", e);
      }
    };

    createFallbackButton();

    // Detecta ChunkLoadError e tenta um reload usando próxima fonte
    const onError = (ev: ErrorEvent) => {
      const msg = ev?.message || "";
      if (msg.includes("Loading chunk") || msg.includes("ChunkLoadError")) {
        console.warn("VLibrasLoader: detectado ChunkLoadError, tentando fallback...");
        const s = document.getElementById("vlibras-script");
        if (s) s.remove();
        (async () => {
          // tryLoad já usa variável tried para seguir para próxima fonte
          await (tryLoad as any)();
        })();
      }
    };

    window.addEventListener("error", onError);

    // Não removemos o script/widget no cleanup: queremos que o widget persista
    // entre navegações SPA e HMR durante o desenvolvimento.
    return () => {
      window.removeEventListener("error", onError);
    };
    // eslint-disable-next-line
  }, [open]);

  // Botão de fechar

  if (!open) {
    return (
      <button
        style={{
          position: "fixed",
          right: 16,
          bottom: 330,
          width: 48,
          height: 48,
          borderRadius: 8,
          border: "none",
          background: "#2563eb",
          color: "white",
          zIndex: 2147483647,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37,99,235,0.18)",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
        }}
        onClick={() => {
          // Remove scripts e widgets antigos antes de reabrir
          removeVLibras();
          setTimeout(() => setOpen(true), 50);
        }}
        aria-label="Abrir VLibras"
        title="Abrir VLibras"
        onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
        onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
        onFocus={e => (e.currentTarget.style.background = '#1d4ed8')}
        onBlur={e => (e.currentTarget.style.background = '#2563eb')}
      >
        <span style={{position: 'absolute', left: '-9999px'}}>Abrir VLibras</span>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="4" y="4" width="24" height="24" rx="7" fill="#2563eb"/>
          <path d="M12 18l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    );
  }

  // Botão de fechar visível quando aberto
  return (
    <button
      style={{
        position: "fixed",
        right: 16,
        bottom: 325,
        width: 48,
        height: 48,
        borderRadius: 8,
        border: "none",
        background: "#ef4444",
        color: "white",
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(239,68,68,0.18)",
        cursor: "pointer",
        transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
      }}
      onClick={() => setOpen(false)}
      aria-label="Fechar VLibras"
      title="Fechar VLibras"
      onMouseOver={e => (e.currentTarget.style.background = '#dc2626')}
      onMouseOut={e => (e.currentTarget.style.background = '#ef4444')}
      onFocus={e => (e.currentTarget.style.background = '#dc2626')}
      onBlur={e => (e.currentTarget.style.background = '#ef4444')}
    >
      <span style={{position: 'absolute', left: '-9999px'}}>Fechar VLibras</span>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="4" y="4" width="24" height="24" rx="7" fill="#b91c1c"/>
        <path d="M12 12l8 8M20 12l-8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
