import { useNavigate } from "react-router-dom";
import { useLoan } from "@/context/LoanContext";
import { formatINR } from "@/lib/format";

const FinancialAnalysisPage = () => {
  const { loanData, ratios, calculateRatios } = useLoan();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Financial Ratio Analysis</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">
        Key financial ratios calculated from borrower data.
      </p>

      {!loanData && (
        <div className="bg-card border border-border rounded-md p-6 text-center">
          <p className="text-muted-foreground font-body text-sm mb-4">
            No loan data available. Submit an application first.
          </p>
          <button
            onClick={() => navigate("/loan-application")}
            className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
          >
            Go to Loan Application
          </button>
        </div>
      )}

      {loanData && (
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-md p-6 md:p-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Submitted Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Annual Revenue", value: formatINR(loanData.annualRevenue) },
                { label: "Total Assets", value: formatINR(loanData.totalAssets) },
                { label: "Total Debt", value: formatINR(loanData.totalDebt) },
                { label: "Net Profit", value: formatINR(loanData.netProfit) },
                { label: "Existing Loan", value: formatINR(loanData.existingLoanAmount) },
                { label: "Credit Score", value: loanData.creditScore.toString() },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-heading text-xl font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {ratios && (
            <div className="bg-card border border-border rounded-md p-6 md:p-8">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-8">Calculated Ratios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Debt to Equity Ratio</p>
                  <p className="font-heading text-5xl font-semibold text-primary">{ratios.debtToEquity.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Profit Margin</p>
                  <p className="font-heading text-5xl font-semibold text-primary">{(ratios.profitMargin * 100).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-2">Loan Exposure</p>
                  <p className="font-heading text-5xl font-semibold text-primary">{ratios.loanExposure.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={calculateRatios}
              className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
            >
              Calculate Ratios
            </button>
            <button
              onClick={() => navigate("/credit-decision")}
              className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
            >
              Proceed to Credit Decision
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalysisPage;
