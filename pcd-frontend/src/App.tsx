import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VagasPage from "./pages/VagasPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/Cadastro/CadastroPage";
import CadastroCandidatoPage from "./pages/Cadastro/CadastroCandidatoPage";
import CadastroEmpresaPage from "./pages/Cadastro/CadastroEmpresaPage";
import CadastroEmpresaMinima from "./pages/Cadastro/CadastroEmpresaMinima";
import FAQPage from "./pages/FAQPage";
import PoliticaPrivacidadePage from "./pages/PoliticaPrivacidadePage";
import EmpresasParceirasPage from "./pages/empresa/EmpresasParceirasPage";
import AccessibilityTestPage from "./pages/AccessibilityTestPage";
import { ColorPaletteDemo } from "./components/ColorPaletteDemo";
import AdminPage from "./pages/admin/AdminPage";
import BarreirasPage from "./pages/admin/BarreirasPage";
import TiposPage from "./pages/admin/TiposPage";
import SubtiposPage from "./pages/admin/SubtiposPage";
import AcessibilidadesPage from "./pages/admin/AcessibilidadesPage";
import VagaPage from "./pages/empresa/VagaPage";
import VagaDetalhePage from "./pages/empresa/VagaDetalhePage";
import EmpresaPage from "./pages/empresa/EmpresaPage";
import CandidatoPage from "./pages/Candidato/CandidatoPage";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import AccessibilityMenu from "./components/AccessibilityMenu";
import SkipLinks from "./components/SkipLinks";

export default function App() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <SkipLinks />
        <AccessibilityMenu />
          
          <BrowserRouter>
            <Routes>
              {/* Páginas Públicas - Para candidatos PCDs */}
              <Route path="/" element={<HomePage />} />
              <Route path="/vagas" element={<VagasPage />} />
              <Route path="/empresas" element={<EmpresasParceirasPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
              <Route path="/teste-acessibilidade" element={<AccessibilityTestPage />} />
              <Route path="/cores" element={<ColorPaletteDemo />} />
              
              {/* Autenticação */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/cadastro/candidato" element={<CadastroCandidatoPage />} />
              <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />
              {/* Página mínima de cadastro (nome, cnpj, email/usuário, senha) */}
              <Route path="/cadastro/empresa-minima" element={<CadastroEmpresaMinima />} />
              {/* <Route path="/vaga/:id" element={<VagaDetalhePage />} /> */}

              {/* Área Admin - Gerenciar tipos, subtipos, barreiras */}
              <Route path="/admin" element={<AdminPage />}>
                <Route index element={<Navigate to="tipos" replace />} />
                <Route path="tipos" element={<TiposPage />} />
                <Route path="subtipos" element={<SubtiposPage />} />
                <Route path="barreiras" element={<BarreirasPage />} />
                <Route path="acessibilidades" element={<AcessibilidadesPage />} />
              </Route>

              {/* Área Empresas - Gerenciar vagas */}
              <Route path="/empresa/:id" element={<EmpresaPage />}>
                <Route path="vagas" element={<VagaPage />} />
                <Route path="vagas/:vagaId" element={<VagaDetalhePage />} />
              </Route>

              {/* 404 */}
              <Route path="/candidato/:id" element={<CandidatoPage />} />
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Página não encontrada</p>
                  </div>
                </div>
              } />
            </Routes>
          </BrowserRouter>
      </div>
    </AccessibilityProvider>
  );
}

