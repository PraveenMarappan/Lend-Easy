import { useNavigate } from "react-router-dom";
import { useLoan } from "@/context/LoanContext";
import { formatINR } from "@/lib/format";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

    const formatCurrency = (num: number | string) => {
      return "Rs. " + Number(num).toLocaleString("en-IN");
    };
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LendEasy \u2013 Credit Appraisal Memo (CAM Report)", pageWidth / 2, 20, { align: "center" });
    
    let currentY = 35;

    doc.setFontSize(14);
    doc.text("1. Borrower Profile", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [],
      body: [
        ["Company", loanData.companyName],
        ["Applicant", loanData.applicantName],
        ["Industry", loanData.industryType],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.text("2. Financial Summary", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [],
      body: [
        ["Annual Revenue", formatCurrency(loanData.annualRevenue)],
        ["Total Assets", formatCurrency(loanData.totalAssets)],
        ["Total Debt", formatCurrency(loanData.totalDebt)],
        ["Net Profit", formatCurrency(loanData.netProfit)],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.text("3. Financial Ratio Analysis", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [],
      body: [
        ["Debt to Equity Ratio", ratios.debtToEquity.toFixed(2)],
        ["Profit Margin", `${(ratios.profitMargin * 100).toFixed(1)}%`],
        ["Loan Exposure Ratio", ratios.loanExposure.toFixed(2)],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(14);
    doc.text("4. Risk Assessment", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [],
      body: [
        ["Credit Score", loanData.creditScore.toString()],
        ["Risk Score", decision.riskScore.toString()],
        ["Risk Category", decision.riskLevel],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.text("5. Lending Recommendation", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      head: [],
      body: [
        ["Loan Status", decision.status],
        ["Approved Credit Limit", formatCurrency(decision.recommendedLimit)],
        ["Interest Rate", `${decision.interestRate}%`],
      ],
      theme: "grid",
      styles: { font: "helvetica", fontSize: 10 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 } }
    });

    const fileName = `CAM_Report_${loanData.companyName.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
    sessionStorage.clear();
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
