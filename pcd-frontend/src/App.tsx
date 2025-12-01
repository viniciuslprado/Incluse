import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import VagasPage from "./pages/VagasPage";
import VagaPublicaPage from "./pages/public/VagaPublicaPage";
import LoginPage from "./pages/public/LoginPage";
import CadastroPage from "./pages/Cadastro/CadastroPage";
import CadastroCandidatoPage from "./pages/Cadastro/CadastroCandidatoPage";
import CadastroEmpresaPage from "./pages/Cadastro/CadastroEmpresaPage";
import CadastroEmpresaMinima from "./pages/Cadastro/CadastroEmpresaMinima";
import RecoverPasswordPage from "./pages/public/RecoverPasswordPage";
import FAQPage from "./pages/public/FAQPage";
import FaqModal from "./components/FaqModal";
import PoliticaPrivacidadePage from "./pages/public/PoliticaPrivacidadePage";
import QuemSomosPage from "./pages/public/QuemSomosPage";
// import AcessibilidadePage from "./pages/AcessibilidadePage";
import EmpresasParceirasPage from "./pages/empresa/EmpresasParceirasPage";
// import AdminPage from "./pages/admin/AdminPage";
import NovaVagaPage from "./pages/empresa/NovaVagaPage";
import PerfilCandidatoPage from "./pages/empresa/PerfilCandidatoPage";
import VagaDetalhePage from "./pages/empresa/VagaDetalhePage";
import EmpresaPage from "./pages/empresa/EmpresaPage";
import CandidatosPorVagaPage from "./pages/empresa/CandidatosPorVagaPage";
import VisualizarCandidatoPage from "./pages/empresa/VisualizarCandidatoPage";
// import AvaliarEmpresaPage from "./pages/empresa/AvaliarEmpresaPage";
import DashboardPage from "./pages/empresa/DashboardPage";
import EmpresaNotificacoesPage from "./pages/empresa/EmpresaNotificacoesPage";
// import EstatisticasPage from "./pages/empresa/EstatisticasPage";
import MinhaContaPage from "./pages/empresa/MinhaContaPage";
import DadosEmpresaPage from "./pages/empresa/DadosEmpresaPage";
// import SeguidoresPage from "./pages/empresa/SeguidoresPage";
// import ServicoPage from "./pages/empresa/ServicoPage";
import GestaoVagasPage from "./pages/empresa/GestaoVagasPage";
import CandidatosGeralPage from "./pages/empresa/CandidatosGeralPage";
import ConfiguracoesEmpresaPage from "./pages/empresa/ConfiguracoesPage";
import EditarVagaPage from "./pages/empresa/EditarVagaPage";

import InicioPage from "./pages/Candidato/InicioPage";
import MinhasCandidaturasPage from "./pages/Candidato/MinhasCandidaturasPage";
import VagasFavoritasPage from "./pages/Candidato/VagasFavoritasPage";
import NotificacoesPage from "./pages/Candidato/NotificacoesPage";
import PerfilPage from "./pages/Perfilmenu/PerfilPage";
import CurriculosEnviadosPage from "./pages/Candidato/CurriculosEnviadosPage";
import ConfiguracoesPage from "./pages/Candidato/ConfiguracoesPage";
import DashboardLayout from "./pages/Candidato/DashboardLayout";
import MeuCurriculoPage from "./pages/Candidato/MeuCurriculoPage";
import CurriculoBasicoEditorPage from "./pages/Candidato/CurriculoBasicoEditorPage";
// import EmpresasPage from "./pages/Candidato/EmpresasPage";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { ToastProvider } from "./components/common/Toast";
import AccessibilityMenu from "./components/AccessibilityMenu";
import FaqFloating from "./components/FaqFloating";
import VLibrasLoader from "./components/VLibrasLoader";




import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

import RequireAdmin from "./components/admin/panel/RequireAdmin";
import AdminDashboard from "./components/admin/panel/AdminDashboard";
import AdminCompanies from "./components/admin/panel/AdminCompanies";

import AdminCandidates from "./components/admin/panel/AdminCandidates";
import AdminJobs from "./components/admin/panel/AdminJobs";
import GestaoAcessibilidadePage from "./pages/admin/GestaoAcessibilidadePage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";
// import VisualizarCurriculoPage from "./pages/empresa/VisualizarCurriculoPage";
import Erro403Page from "./pages/public/Erro403Page";
import TermosDeUsoPage from "./pages/public/TermosDeUsoPage";
import AdminPanelPage from "./pages/admin/PanelPage";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <FaqFloating />
      <FaqModal />
      <Routes>
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/vagas" element={<VagasPage />} />
        <Route path="/vagas/:vagaId" element={<VagaPublicaPage />} />
        {/* Redireciona /vaga/:vagaId para /login */}
        <Route path="/vaga/:vagaId" element={<Navigate to="/login" replace />} />
        <Route path="/empresas" element={<EmpresasParceirasPage />} />
        <Route path="/quem-somos" element={<QuemSomosPage />} />
        {/* <Route path="/acessibilidade" element={<AcessibilidadePage />} /> */}
        <Route path="/politica-privacidade" element={<PoliticaPrivacidadePage />} />
        <Route path="/termos-de-uso" element={<TermosDeUsoPage />} />
        <Route path="/erro403" element={<Erro403Page />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/cadastro/candidato" element={<CadastroCandidatoPage />} />
        <Route path="/cadastro/empresa" element={<CadastroEmpresaPage />} />
        <Route path="/cadastro/empresa-minima" element={<CadastroEmpresaMinima />} />

        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminPanelPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="empresas" element={<AdminCompanies />} />
            <Route path="candidatos" element={<AdminCandidates />} />
            <Route path="vagas" element={<AdminJobs />} />
            <Route path="gestao-acessibilidade" element={<GestaoAcessibilidadePage />} />
            <Route path="logs" element={<AdminLogsPage />} />
          </Route>
        </Route>
        {/* Rotas antigas de acessibilidade removidas. Use apenas a tela de Gestão de Acessibilidade. */}

        <Route path="/empresa/:id" element={<EmpresaPage />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="gestao-vagas" element={<GestaoVagasPage />} />
          <Route path="notificacoes" element={<EmpresaNotificacoesPage />} />
          <Route path="vagas/nova" element={<NovaVagaPage />} />
          <Route path="vagas/:vagaId/editar" element={<EditarVagaPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="anunciar" element={<NovaVagaPage />} />
          <Route path="candidatos" element={<CandidatosGeralPage />} />
          {/* <Route path="avaliar" element={<AvaliarEmpresaPage />} /> */}
          <Route path="vagas/:vagaId/candidatos" element={<CandidatosPorVagaPage />} />
          <Route path="candidatos/:candidatoId" element={<PerfilCandidatoPage />} />
          <Route path="visualizar-candidato/:candidatoId" element={<VisualizarCandidatoPage />} />
          {/* <Route path="visualizar-curriculo/:candidatoId" element={<VisualizarCurriculoPage />} /> */}
          <Route path="vagas/:vagaId" element={<VagaDetalhePage />} />
          {/* <Route path="seguidores" element={<SeguidoresPage />} /> */}
          {/* <Route path="estatisticas" element={<EstatisticasPage />} /> */}
          <Route path="minha-conta" element={<MinhaContaPage />} />
          <Route path="dados" element={<DadosEmpresaPage />} />
          {/* <Route path="servico" element={<ServicoPage />} /> */}
          <Route path="configuracoes" element={<ConfiguracoesEmpresaPage />} />
        </Route>

        <Route path="/candidato/:id" element={<DashboardLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="inicio" element={<InicioPage />} />
          <Route path="favoritas" element={<VagasFavoritasPage />} />
          <Route path="candidaturas" element={<MinhasCandidaturasPage />} />
          <Route path="minhas-candidaturas" element={<MinhasCandidaturasPage />} />
          <Route path="vagas" element={<MinhasCandidaturasPage />} /> {/* rota antiga mantida */}
          <Route path="curriculo" element={<MeuCurriculoPage />} />
          <Route path="curriculo/editor" element={<CurriculoBasicoEditorPage />} />
          <Route path="curriculo/basico" element={<CurriculoBasicoEditorPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="notificacoes" element={<NotificacoesPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="historico" element={<CurriculosEnviadosPage />} />
          {/* <Route path="empresas" element={<EmpresasPage />} /> */}
        </Route>
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">404</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Página não encontrada</p>
            </div>
          </div>
        } />

      </Routes>
    </>
  );
}

// useVlibras removido: VLibras é carregado via HTML estático

export default function App() {
  return (
    <AccessibilityProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <VLibrasLoader />
          <AccessibilityMenu />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </ToastProvider>
    </AccessibilityProvider>
  );
}

