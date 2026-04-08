import { useNavigate } from "react-router-dom";
import { useLoan } from "@/context/LoanContext";
import { formatINR } from "@/lib/format";

const CreditDecisionPage = () => {
  const { loanData, ratios, decision, generateDecision, calculateRatios } = useLoan();
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!ratios && loanData) calculateRatios();
    setTimeout(() => generateDecision(), 50);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Credit Decision</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">
        AI-based lending recommendation.
      </p>

      {!loanData && (
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <p className="text-muted-foreground font-body text-sm mb-4">
            No loan data available.
          </p>
          <button onClick={() => navigate("/loan-application")} className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors">
            Go to Loan Application
          </button>
        </div>
      )}

      {loanData && !decision && (
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <p className="text-muted-foreground font-body text-sm mb-4">
            Click below to generate the credit decision.
          </p>
          <button onClick={handleGenerate} className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors">
            Generate Decision
          </button>
        </div>
      )}

      {decision && (
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-md p-6 md:p-8 text-center">
            <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-3">Decision</p>
            <p className={`font-heading text-4xl md:text-5xl font-semibold ${
              decision.status === "APPROVED" ? "text-primary" :
              decision.status === "CONDITIONAL APPROVAL" ? "text-[#FD7E14]" : "text-destructive"
            }`}>
              {decision.status}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-md p-6">
              <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Recommended Credit Limit</p>
              <p className="font-heading text-3xl font-semibold text-foreground">{formatINR(decision.recommendedLimit)}</p>
            </div>
            <div className="bg-card border border-border rounded-md p-6">
              <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Interest Rate</p>
              <p className="font-heading text-3xl font-semibold text-foreground">{decision.interestRate}%</p>
            </div>
            <div className="bg-card border border-border rounded-md p-6">
              <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Risk Score</p>
              <p className="font-heading text-3xl font-semibold text-foreground">{decision.riskScore}</p>
            </div>
            <div className="bg-card border border-border rounded-md p-6">
              <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Risk Level</p>
              <p className={`font-heading text-3xl font-semibold ${
                decision.riskLevel === "Low" ? "text-primary" :
                decision.riskLevel === "Medium" ? "text-[#FD7E14]" : "text-destructive"
              }`}>
                {decision.riskLevel}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/cam-report")} className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors">
              Generate CAM Report
            </button>
            <button onClick={() => navigate("/financial-analysis")} className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors">
              Back to Financial Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditDecisionPage;
