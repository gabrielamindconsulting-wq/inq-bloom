import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import ScreeningFlow from "./pages/ScreeningFlow";
import ScreeningReport from "./pages/ScreeningReport";
import QRCodePage from "./pages/QRCodePage";
import UsersPage from "./pages/UsersPage";
import ClinicalDashboard from "./pages/ClinicalDashboard";
import AgendaPage from "./pages/AgendaPage";
import SubstitutionsPage from "./pages/SubstitutionsPage";
import ClinicalPatientsPage from "./pages/ClinicalPatientsPage";
import ClinicalPatientDetail from "./pages/ClinicalPatientDetail";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import ProfessionalDetail from "./pages/ProfessionalDetail";
import CheckinPage from "./pages/CheckinPage";
import RoomsPage from "./pages/RoomsPage";
import PatientFormPage from "./pages/PatientFormPage";
import ConveniosPage from "./pages/ConveniosPage";
import GuiasPage from "./pages/GuiasPage";
import FaturamentoPage from "./pages/FaturamentoPage";
import GlosasPage from "./pages/GlosasPage";
import RepassesPage from "./pages/RepassesPage";
import FluxoCaixaPage from "./pages/FluxoCaixaPage";
import MargemPage from "./pages/MargemPage";
import DrePage from "./pages/DrePage";
import ProtocolosPage from "./pages/ProtocolosPage";
import PtsPage from "./pages/PtsPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import OcupacaoPage from "./pages/OcupacaoPage";
import MetasAgendaPage from "./pages/MetasAgendaPage";
import GradeConvenioPage from "./pages/GradeConvenioPage";
import RhPage from "./pages/RhPage";
import CrmPage from "./pages/CrmPage";
import IaPage from "./pages/IaPage";
import GovernancaPage from "./pages/GovernancaPage";
import NotFound from "./pages/NotFound";

import NotificacoesPage from "./pages/NotificacoesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paciente/:id" element={<PatientDetail />} />
          <Route path="/triagem/:id" element={<ScreeningFlow />} />
          <Route path="/relatorio/:id" element={<ScreeningReport />} />
          <Route path="/qrcode" element={<QRCodePage />} />
          <Route path="/notificacoes" element={<NotificacoesPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/clinico" element={<ClinicalDashboard />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/substituicoes" element={<SubstitutionsPage />} />
          <Route path="/pacientes" element={<ClinicalPatientsPage />} />
          <Route path="/pacientes/novo" element={<PatientFormPage />} />
          <Route path="/pacientes/:id/editar" element={<PatientFormPage />} />
          <Route path="/pacientes/:id" element={<ClinicalPatientDetail />} />
          <Route path="/profissionais" element={<ProfessionalsPage />} />
          <Route path="/profissionais/:id" element={<ProfessionalDetail />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/salas" element={<RoomsPage />} />
          <Route path="/convenios" element={<ConveniosPage />} />
          <Route path="/guias" element={<GuiasPage />} />
          <Route path="/faturamento" element={<FaturamentoPage />} />
          <Route path="/glosas" element={<GlosasPage />} />
          <Route path="/repasses" element={<RepassesPage />} />
          <Route path="/fluxo-caixa" element={<FluxoCaixaPage />} />
          <Route path="/margem" element={<MargemPage />} />
          <Route path="/dre" element={<DrePage />} />
          <Route path="/protocolos" element={<ProtocolosPage />} />
          <Route path="/pts" element={<PtsPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/ocupacao" element={<OcupacaoPage />} />
          <Route path="/metas-agenda" element={<MetasAgendaPage />} />
          <Route path="/grade-convenio" element={<GradeConvenioPage />} />
          <Route path="/rh" element={<RhPage />} />
          <Route path="/crm" element={<CrmPage />} />
          <Route path="/ia" element={<IaPage />} />
          <Route path="/governanca" element={<GovernancaPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
