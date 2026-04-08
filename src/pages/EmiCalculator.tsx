import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatINR } from "@/lib/format";

function formatCurrency(num: number | string) {
  return "Rs. " + Number(num).toLocaleString("en-IN");
}

const EmiCalculator = () => {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [tenureMonths, setTenureMonths] = useState<string>("");

  const [emiOutput, setEmiOutput] = useState<{
    emi: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const calculateEMI = () => {
    const P = Number(loanAmount);
    const annualRate = Number(interestRate);
    const N = Number(tenureMonths);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate <= 0 || isNaN(N) || N <= 0) {
      alert("Please enter valid positive numbers for all fields");
      return;
    }

    const R = annualRate / 12 / 100;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    setEmiOutput({
      emi,
      totalPayment,
      totalInterest,
    });
  };

  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenureMonths("");
    setEmiOutput(null);
  };

  const downloadPDF = () => {
    if (!emiOutput) return;

    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("EMI Report", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Report Generated On: ${new Date().toLocaleDateString()}`, 14, 35);

    autoTable(doc, {
      startY: 45,
      head: [["Description", "Details"]],
      body: [
        ["Loan Amount", formatCurrency(Number(loanAmount))],
        ["Interest Rate (% per year)", `${interestRate}%`],
        ["Tenure (Months)", `${tenureMonths} Months`],
        ["Monthly EMI", formatCurrency(emiOutput.emi)],
        ["Total Interest", formatCurrency(emiOutput.totalInterest)],
        ["Total Payment", formatCurrency(emiOutput.totalPayment)],
      ],
      theme: "striped",
      headStyles: { fillColor: [60, 60, 60] },
      styles: { fontSize: 12, cellPadding: 6 },
    });

    doc.save("EMI_Report.pdf");
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">EMI Calculator</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">
        Calculate your Monthly EMI, Total Interest, and Total Payment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-md p-6 md:p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Loan Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1 block">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter loan amount"
              />
            </div>
            
            <div>
              <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1 block">
                Interest Rate (% per year)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter annual interest rate"
              />
            </div>

            <div>
              <label className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1 block">
                Loan Tenure (Months)
              </label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground font-body focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter tenure in months"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={calculateEMI}
              className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
            >
              Calculate EMI
            </button>
            <button
              onClick={handleReset}
              className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          {emiOutput ? (
            <div className="bg-card border border-border rounded-md p-6 md:p-8 space-y-8">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Calculation Results</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1">Monthly EMI</p>
                  <p className="font-heading text-4xl font-semibold text-primary">{formatINR(emiOutput.emi)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1">Total Payment</p>
                    <p className="font-heading text-2xl font-semibold text-foreground">{formatINR(emiOutput.totalPayment)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-body uppercase tracking-wider mb-1">Total Interest</p>
                    <p className="font-heading text-2xl font-semibold text-foreground">{formatINR(emiOutput.totalInterest)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                <button
                  onClick={downloadPDF}
                  className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
                >
                  Download EMI Report (PDF)
                </button>
              </div>
            </div>
          ) : (
             <div className="bg-card border border-border rounded-md p-6 md:p-8 h-[300px] flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground font-body">Enter loan details and click Calculate to view results.</p>
             </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-card text-foreground border border-border font-body font-medium py-2 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EmiCalculator;
