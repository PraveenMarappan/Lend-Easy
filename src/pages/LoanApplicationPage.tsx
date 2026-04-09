import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoan, LoanData } from "@/context/LoanContext";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const fields: { label: string; key: keyof LoanData; type: "text" | "number" }[] = [
  { label: "Company Name", key: "companyName", type: "text" },
  { label: "Applicant Name", key: "applicantName", type: "text" },
  { label: "Industry Type", key: "industryType", type: "text" },
  { label: "Annual Revenue (₹)", key: "annualRevenue", type: "number" },
  { label: "Total Assets (₹)", key: "totalAssets", type: "number" },
  { label: "Total Debt (₹)", key: "totalDebt", type: "number" },
  { label: "Net Profit (₹)", key: "netProfit", type: "number" },
  { label: "Existing Loan Amount (₹)", key: "existingLoanAmount", type: "number" },
  { label: "Credit Score", key: "creditScore", type: "number" },
];

const defaults: LoanData = {
  companyName: "",
  applicantName: "",
  industryType: "",
  annualRevenue: 0,
  totalAssets: 0,
  totalDebt: 0,
  netProfit: 0,
  existingLoanAmount: 0,
  creditScore: 0,
};

const LoanApplicationPage = () => {
  const { loanData, setLoanData, resetAll } = useLoan();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoanData>(loanData || defaults);
  const [submitted, setSubmitted] = useState(!!loanData);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (key: keyof LoanData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: fields.find((f) => f.key === key)?.type === "number" ? Number(value) || 0 : value,
    }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    for (const f of fields) {
      if (f.type === "text" && !form[f.key]) {
        newErrors[f.key] = true;
        isValid = false;
      } else if (f.type === "number" && (form[f.key] === 0 || form[f.key] === "")) {
        newErrors[f.key] = true;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoanData(form);
      setSubmitted(true);
      return true;
    } else {
      toast.error("Please fill all required fields");
      return false;
    }
  };

  const handleReset = () => {
    resetAll();
    setForm(defaults);
    setSubmitted(false);
    setErrors({});
  };

  const handleMagicFill = () => {
    setForm({
      companyName: "Arun Tech Solutions Pvt Ltd",
      applicantName: "Praveen M",
      industryType: "Technology Services",
      annualRevenue: 25000000,
      totalAssets: 60000000,
      totalDebt: 15000000,
      netProfit: 4200000,
      existingLoanAmount: 5000000,
      creditScore: 782,
    });
    setErrors({});
    toast.success("Demo data filled successfully.");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Loan Application</h1>
          <p className="text-muted-foreground font-body text-sm m-0">
            Enter the borrower's financial information below.
          </p>
        </div>
        <button
          onClick={handleMagicFill}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border font-body font-medium py-2 px-4 rounded-md hover:bg-[#DEE2E6] transition-colors text-sm"
        >
          <Wand2 className="w-4 h-4" />
          Magic Fill
        </button>
      </div>

      <div className="bg-card border border-border rounded-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.key} className="flex flex-col">
              <label className="text-sm font-body font-medium text-muted-foreground mb-1.5">
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.type === "number" && form[f.key] === 0 ? "" : form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                placeholder={f.type === "number" ? "0" : `Enter ${f.label.toLowerCase()}`}
                className={`bg-background border ${errors[f.key] ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"} rounded-md px-4 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1`}
              />
              {errors[f.key] && (
                <span className="text-red-500 text-xs mt-1">This field is required</span>
              )}
            </div>
          ))}
        </div>

        {submitted && (
          <p className="mt-6 text-primary font-body text-sm font-medium">
            ✓ Application data submitted successfully.
          </p>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 w-full">
          <div className="flex-1 flex justify-start w-full">
            <button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
            >
              Submit Application
            </button>
          </div>
          <div className="flex-1 flex justify-center w-full">
            <button
              onClick={() => {
                if (handleSubmit()) {
                  navigate("/workflow-pipeline");
                }
              }}
              className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
            >
              Proceed to Workflow Pipeline
            </button>
          </div>
          <div className="flex-1 flex justify-end w-full">
            <button
              onClick={handleReset}
              className="bg-secondary text-secondary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
