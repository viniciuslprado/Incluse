/* import SubtiposPage from "./pages/SubtiposPage";
import TiposPage from "./pages/TiposPage";
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SubtiposPage />
    </div>
  );
}
 */

import { useState, useEffect } from "react";
import SubtiposPage from "./pages/SubtiposPage";
import TiposPage from "./pages/TiposPage";

export default function App() {
  const [dark, setDark] = useState(() => {
    // Carrega tema salvo ou usa "claro" como padrão
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors">
      {/* Botão para alternar o tema */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          Alternar Tema
        </button>
      </div>

      {/* Suas páginas */}
      <SubtiposPage />
      {/* <TiposPage /> se quiser exibir também */}
    </div>
  );
}
