import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface LoanData {
  companyName: string;
  applicantName: string;
  industryType: string;
  annualRevenue: number;
  totalAssets: number;
  totalDebt: number;
  netProfit: number;
  existingLoanAmount: number;
  creditScore: number;
}

export interface FinancialRatios {
  debtToEquity: number;
  profitMargin: number;
  loanExposure: number;
}

export interface CreditDecision {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  status: "APPROVED" | "CONDITIONAL APPROVAL" | "REJECTED";
  recommendedLimit: number;
  interestRate: number;
}

export type PipelineStep = {
  name: string;
  status: "pending" | "processing" | "completed";
};

interface LoanContextType {
  loanData: LoanData | null;
  setLoanData: (data: LoanData) => void;
  ratios: FinancialRatios | null;
  calculateRatios: () => FinancialRatios | null;
  decision: CreditDecision | null;
  generateDecision: () => CreditDecision | null;
  pipelineSteps: PipelineStep[];
  setPipelineSteps: React.Dispatch<React.SetStateAction<PipelineStep[]>>;
  resetAll: () => void;
}

const defaultSteps: PipelineStep[] = [
  { name: "Data Collection", status: "pending" },
  { name: "Data Validation", status: "pending" },
  { name: "Financial Ratio Calculation", status: "pending" },
  { name: "Risk Assessment", status: "pending" },
  { name: "Credit Decision", status: "pending" },
  { name: "CAM Report Generation", status: "pending" },
];

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider = ({ children }: { children: ReactNode }) => {
  const [loanData, setLoanData] = useState<LoanData | null>(() => {
    const saved = sessionStorage.getItem("loanData");
    return saved ? JSON.parse(saved) : null;
  });
  const [ratios, setRatios] = useState<FinancialRatios | null>(() => {
    const saved = sessionStorage.getItem("ratios");
    return saved ? JSON.parse(saved) : null;
  });
  const [decision, setDecision] = useState<CreditDecision | null>(() => {
    const saved = sessionStorage.getItem("decision");
    return saved ? JSON.parse(saved) : null;
  });
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(() => {
    const saved = sessionStorage.getItem("pipelineSteps");
    return saved ? JSON.parse(saved) : defaultSteps;
  });

  useEffect(() => {
    if (loanData) sessionStorage.setItem("loanData", JSON.stringify(loanData));
    else sessionStorage.removeItem("loanData");
  }, [loanData]);

  useEffect(() => {
    if (ratios) sessionStorage.setItem("ratios", JSON.stringify(ratios));
    else sessionStorage.removeItem("ratios");
  }, [ratios]);

  useEffect(() => {
    if (decision) sessionStorage.setItem("decision", JSON.stringify(decision));
    else sessionStorage.removeItem("decision");
  }, [decision]);

  useEffect(() => {
    sessionStorage.setItem("pipelineSteps", JSON.stringify(pipelineSteps));
  }, [pipelineSteps]);

  const calculateRatios = () => {
    if (!loanData) return null;
    const equity = loanData.totalAssets - loanData.totalDebt;
    const r: FinancialRatios = {
      debtToEquity: equity > 0 ? loanData.totalDebt / equity : 999,
      profitMargin: loanData.annualRevenue > 0 ? loanData.netProfit / loanData.annualRevenue : 0,
      loanExposure: loanData.totalAssets > 0 ? loanData.existingLoanAmount / loanData.totalAssets : 0,
    };
    setRatios(r);
    return r;
  };

  const generateDecision = () => {
    if (!loanData || !ratios) return null;
    const debtFactor = Math.max(0, Math.min(1, 1 - ratios.debtToEquity));
    const profitFactor = Math.max(0, Math.min(1, ratios.profitMargin));
    const creditFactor = Math.max(0, Math.min(1, loanData.creditScore / 900));

    const riskScore = Math.round(
      (0.3 * debtFactor + 0.3 * profitFactor + 0.4 * creditFactor) * 100
    );

    let riskLevel: CreditDecision["riskLevel"];
    let status: CreditDecision["status"];
    let interestRate: number;

    if (riskScore >= 65) {
      riskLevel = "Low";
      status = "APPROVED";
      interestRate = 9;
    } else if (riskScore >= 40) {
      riskLevel = "Medium";
      status = "CONDITIONAL APPROVAL";
      interestRate = 11;
    } else {
      riskLevel = "High";
      status = "REJECTED";
      interestRate = 15;
    }

    const recommendedLimit = status === "REJECTED" ? 0 : Math.round(loanData.annualRevenue * 0.4);

    const d: CreditDecision = { riskScore, riskLevel, status, recommendedLimit, interestRate };
    setDecision(d);
    return d;
  };

  const resetAll = () => {
    setLoanData(null);
    setRatios(null);
    setDecision(null);
    setPipelineSteps(defaultSteps);
    sessionStorage.removeItem("loanData");
    sessionStorage.removeItem("ratios");
    sessionStorage.removeItem("decision");
    sessionStorage.removeItem("pipelineSteps");
    sessionStorage.clear();
  };

  return (
    <LoanContext.Provider value={{ loanData, setLoanData, ratios, calculateRatios, decision, generateDecision, pipelineSteps, setPipelineSteps, resetAll }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error("useLoan must be used within LoanProvider");
  return ctx;
};
