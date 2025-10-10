import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage.tsx";
import BarreirasPage from "./pages/admin/BarreirasPage.tsx";
import TiposPage from "./pages/admin/TiposPage.tsx";
import SubtiposPage from "./pages/admin/SubtiposPage.tsx";
import AcessibilidadesPage from "./pages/admin/AcessibilidadesPage.tsx";
import VagaPage from "./pages/empresa/VagaPage.tsx";
import VagaDetalhePage from "./pages/empresa/VagaDetalhePage.tsx";
import EmpresaPage from "./pages/empresa/EmpresaPage.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle.tsx";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Botão de tema fixo no canto superior direito */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <BrowserRouter>
      <Routes>
        {/* Redireciona raiz para /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Área admin com layout e rotas filhas */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="tipos" replace />} />
          <Route path="tipos" element={<TiposPage />} />
          <Route path="subtipos" element={<SubtiposPage />} />
          <Route path="barreiras" element={<BarreirasPage />} />
          <Route path="acessibilidades" element={<AcessibilidadesPage />} />
        </Route>

        {/* Área da empresa com layout e rotas filhas */}
        <Route path="/empresa/:id" element={<EmpresaPage />}>
          <Route path="vagas" element={<VagaPage />} />
          <Route path="vagas/:vagaId" element={<VagaDetalhePage />} />
        </Route>


        {/* 404 simples */}
        <Route path="*" element={<div className="container-page py-8">Página não encontrada.</div>} />
      </Routes>

    </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

