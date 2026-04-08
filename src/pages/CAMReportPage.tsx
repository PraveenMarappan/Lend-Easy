import { useNavigate } from "react-router-dom";
import { useLoan } from "@/context/LoanContext";
import { formatINR } from "@/lib/format";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="font-heading text-xl font-semibold text-primary mb-4 pb-2 border-b border-border">{title}</h2>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-border last:border-b-0">
    <span className="text-muted-foreground font-body text-sm">{label}</span>
    <span className="text-foreground font-body text-sm font-medium">{value}</span>
  </div>
);

const CAMReportPage = () => {
  const { loanData, ratios, decision, resetAll } = useLoan();
  const navigate = useNavigate();

  const isReady = loanData && ratios && decision;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!isReady) return;
    const content = `
CREDIT APPRAISAL MEMO
=====================

1. BORROWER PROFILE
Company: ${loanData.companyName}
Applicant: ${loanData.applicantName}
Industry: ${loanData.industryType}

2. FINANCIAL SUMMARY
Annual Revenue: ${formatINR(loanData.annualRevenue)}
Total Assets: ${formatINR(loanData.totalAssets)}
Total Debt: ${formatINR(loanData.totalDebt)}
Net Profit: ${formatINR(loanData.netProfit)}

3. FINANCIAL RATIOS
Debt to Equity: ${ratios.debtToEquity.toFixed(2)}
Profit Margin: ${(ratios.profitMargin * 100).toFixed(1)}%
Loan Exposure: ${ratios.loanExposure.toFixed(2)}

4. RISK ASSESSMENT
Credit Score: ${loanData.creditScore}
Risk Score: ${decision.riskScore}
Risk Category: ${decision.riskLevel}

5. LENDING RECOMMENDATION
Status: ${decision.status}
Approved Credit Limit: ${formatINR(decision.recommendedLimit)}
Interest Rate: ${decision.interestRate}%
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAM_Report_${loanData.companyName.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isReady) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">CAM Report</h1>
        <div className="bg-card border border-border rounded-md p-6 text-center mt-8">
          <p className="text-muted-foreground font-body text-sm mb-4">
            Complete all previous steps to generate the CAM Report.
          </p>
          <button onClick={() => navigate("/loan-application")} className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors">
            Start from Loan Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Credit Appraisal Memo</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">
        Auto-generated CAM report for {loanData.companyName}.
      </p>

      <div className="bg-card border border-border rounded-md p-6 md:p-8" id="cam-report">
        <Section title="1. Borrower Profile">
          <Row label="Company Name" value={loanData.companyName} />
          <Row label="Applicant Name" value={loanData.applicantName} />
          <Row label="Industry" value={loanData.industryType} />
        </Section>

        <Section title="2. Financial Summary">
          <Row label="Annual Revenue" value={formatINR(loanData.annualRevenue)} />
          <Row label="Total Assets" value={formatINR(loanData.totalAssets)} />
          <Row label="Total Debt" value={formatINR(loanData.totalDebt)} />
          <Row label="Net Profit" value={formatINR(loanData.netProfit)} />
        </Section>

        <Section title="3. Financial Ratio Analysis">
          <Row label="Debt to Equity Ratio" value={ratios.debtToEquity.toFixed(2)} />
          <Row label="Profit Margin" value={`${(ratios.profitMargin * 100).toFixed(1)}%`} />
          <Row label="Loan Exposure Ratio" value={ratios.loanExposure.toFixed(2)} />
        </Section>

        <Section title="4. Risk Assessment">
          <Row label="Credit Score" value={loanData.creditScore.toString()} />
          <Row label="Risk Score" value={decision.riskScore.toString()} />
          <Row label="Risk Category" value={decision.riskLevel} />
        </Section>

        <Section title="5. Lending Recommendation">
          <Row label="Loan Status" value={decision.status} />
          <Row label="Approved Credit Limit" value={formatINR(decision.recommendedLimit)} />
          <Row label="Interest Rate" value={`${decision.interestRate}%`} />
        </Section>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <button onClick={handleDownload} className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors">
          Download CAM Report
        </button>
        <button onClick={handlePrint} className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors">
          Print Report
        </button>
        <button
          onClick={() => { resetAll(); navigate("/loan-application"); }}
          className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
        >
          Start New Application
        </button>
      </div>
    </div>
  );
};

export default CAMReportPage;
