import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoanProvider } from "@/context/LoanContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "./pages/HomePage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import WorkflowPipelinePage from "./pages/WorkflowPipelinePage";
import FinancialAnalysisPage from "./pages/FinancialAnalysisPage";
import CreditDecisionPage from "./pages/CreditDecisionPage";
import CAMReportPage from "./pages/CAMReportPage";
import NotFound from "./pages/NotFound";
import EmiCalculator from "./pages/EmiCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LoanProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/emi-calculator" element={<EmiCalculator />} />
              <Route path="/loan-application" element={<LoanApplicationPage />} />
              <Route path="/workflow-pipeline" element={<WorkflowPipelinePage />} />
              <Route path="/financial-analysis" element={<FinancialAnalysisPage />} />
              <Route path="/credit-decision" element={<CreditDecisionPage />} />
              <Route path="/cam-report" element={<CAMReportPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LoanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
