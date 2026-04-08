import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mt-16 mb-6">
        AI-Powered <span className="text-primary">Credit Decisioning</span> Engine
      </h1>
      <p className="text-muted-foreground font-body text-lg max-w-2xl mb-4 leading-relaxed">
        An automated credit evaluation system with financial ratio analysis,
        risk scoring, and Credit Appraisal Memo generation — built for Indian
        financial institutions.
      </p>
      <p className="text-muted-foreground font-body text-sm max-w-xl mb-12">
        From borrower data entry to a downloadable CAM report in minutes.
        All financial values in Indian Rupees (₹).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          to="/loan-application"
          className="bg-primary text-primary-foreground font-body font-medium py-3 px-6 rounded-md hover:bg-[#218838] transition-colors text-center"
        >
          Start Loan Application
        </Link>
        <Link
          to="/workflow-pipeline"
          className="bg-card text-foreground border border-border font-body font-medium py-3 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors text-center"
        >
          View Workflow Pipeline
        </Link>
        <Link
          to="/financial-analysis"
          className="bg-card text-foreground border border-border font-body font-medium py-3 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors text-center"
        >
          Financial Analysis
        </Link>
        <Link
          to="/credit-decision"
          className="bg-card text-foreground border border-border font-body font-medium py-3 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors text-center"
        >
          Credit Decision
        </Link>
        <Link
          to="/cam-report"
          className="sm:col-span-2 bg-primary text-primary-foreground font-body font-medium py-3 px-6 rounded-md hover:bg-[#218838] transition-colors text-center"
        >
          Generate CAM Report
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
        {[
          { title: "Automated Analysis", desc: "Financial ratios calculated instantly from submitted data." },
          { title: "AI Risk Scoring", desc: "Algorithm-based credit risk assessment using weighted factors." },
          { title: "CAM Generation", desc: "Structured Credit Appraisal Memo generated automatically." },
        ].map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-md p-6">
            <h3 className="font-heading text-lg font-semibold text-primary mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm font-body">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
