import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VagasPage from "./pages/VagasPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/Cadastro/CadastroPage";
import CadastroCandidatoPage from "./pages/Cadastro/CadastroCandidatoPage";
import CadastroEmpresaPage from "./pages/Cadastro/CadastroEmpresaPage";
import CadastroEmpresaMinima from "./pages/Cadastro/CadastroEmpresaMinima";
import FAQPage from "./pages/FAQPage";
import FaqModal from "./components/FaqModal";
import PoliticaPrivacidadePage from "./pages/PoliticaPrivacidadePage";
import QuemSomosPage from "./pages/QuemSomosPage";
import AcessibilidadePage from "./pages/AcessibilidadePage";
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
import AnunciarVagaPage from "./pages/empresa/AnunciarVagaPage";
import CandidatosPorVagaPage from "./pages/empresa/CandidatosPorVagaPage";
import AvaliarEmpresaPage from "./pages/empresa/AvaliarEmpresaPage";
import DashboardPage from "./pages/empresa/DashboardPage";
import EstatisticasPage from "./pages/empresa/EstatisticasPage";
import MinhaContaPage from "./pages/empresa/MinhaContaPage";
import DadosEmpresaPage from "./pages/empresa/DadosEmpresaPage";
import SeguidoresPage from "./pages/empresa/SeguidoresPage";
import ServicoPage from "./pages/empresa/ServicoPage";
import CandidatoPage from "./pages/Candidato/CandidatoPage";
import InicioPage from "./pages/Candidato/InicioPage";
import CandidatoVagasPage from "./pages/Candidato/CandidatoVagasPage";
import VagasSalvasPage from "./pages/Candidato/VagasSalvasPage";
import EmpresasPage from "./pages/Candidato/EmpresasPage";
import NotificacoesPage from "./pages/Candidato/NotificacoesPage";
import PerfilPage from "./pages/Perfilmenu/PerfilPage";
import EmpresasFavoritasPage from "./pages/Candidato/EmpresasFavoritasPage";
import CurriculosEnviadosPage from "./pages/Candidato/CurriculosEnviadosPage";
import BuscarVagasPage from "./pages/Candidato/BuscarVagasPage";
import ConfiguracoesPage from "./pages/Candidato/ConfiguracoesPage";
import DashboardLayout from "./pages/Candidato/DashboardLayout";
import MeuCurriculoPage from "./pages/Candidato/MeuCurriculoPage";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { ToastProvider } from "./components/ui/Toast";
import AccessibilityMenu from "./components/AccessibilityMenu";
import SkipLinks from "./components/SkipLinks";
import FaqFloating from "./components/FaqFloating";
import ContatoPage from "./pages/ContatoPage";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AccessibilityProvider>
      <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <SkipLinks />
        <AccessibilityMenu />
          
          <BrowserRouter>
            <Navbar />
            <FaqFloating />
            <FaqModal />
            <Routes>
              {/* Páginas Públicas - Para candidatos PCDs */}
              <Route path="/" element={<HomePage />} />
              <Route path="/vagas" element={<VagasPage />} />
              <Route path="/empresas" element={<EmpresasParceirasPage />} />
              <Route path="/quem-somos" element={<QuemSomosPage />} />
              <Route path="/acessibilidade" element={<AcessibilidadePage />} />
              <Route path="/contato" element={<ContatoPage />} />
              {/* Public FAQ is available via floating modal on desktop; remove public route */}
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
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="vagas" element={<VagaPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="anunciar" element={<AnunciarVagaPage />} />
                <Route path="candidatos" element={<CandidatosPorVagaPage />} />
                <Route path="avaliar" element={<AvaliarEmpresaPage />} />
                <Route path="vagas/:vagaId/candidatos" element={<CandidatosPorVagaPage />} />
                <Route path="vagas/:vagaId" element={<VagaDetalhePage />} />
                <Route path="seguidores" element={<SeguidoresPage />} />
                <Route path="estatisticas" element={<EstatisticasPage />} />
                <Route path="minha-conta" element={<MinhaContaPage />} />
                <Route path="dados" element={<DadosEmpresaPage />} />
                <Route path="servico" element={<ServicoPage />} />
              </Route>

              {/* 404 */}
              <Route path="/candidato/:id" element={<DashboardLayout />}>
                <Route index element={<InicioPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="vagas" element={<CandidatoVagasPage />} />
                <Route path="curriculo" element={<MeuCurriculoPage />} />
                <Route path="salvas" element={<VagasSalvasPage />} />
                <Route path="empresas" element={<EmpresasPage />} />
                <Route path="notificacoes" element={<NotificacoesPage />} />
                <Route path="historico" element={<CurriculosEnviadosPage />} />
                <Route path="buscar" element={<BuscarVagasPage />} />
                <Route path="perfil" element={<PerfilPage />} />
                <Route path="favoritas" element={<EmpresasFavoritasPage />} />
                <Route path="configuracoes" element={<ConfiguracoesPage />} />
              </Route>
              {/* Floating FAQ (link) - aparece em todas as páginas públicas */}
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
      </ToastProvider>
    </AccessibilityProvider>
  );
}

