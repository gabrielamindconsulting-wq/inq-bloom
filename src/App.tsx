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
import NotFound from "./pages/NotFound";

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
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
