import { useNavigate } from "react-router-dom";
import { useLoan } from "@/context/LoanContext";
import { CheckCircle2 } from "lucide-react";

const WorkflowPipelinePage = () => {
  const { pipelineSteps, setPipelineSteps, loanData, calculateRatios, generateDecision } = useLoan();
  const navigate = useNavigate();

  const runPipeline = async () => {
    if (!loanData) return;

    for (let i = 0; i < pipelineSteps.length; i++) {
      setPipelineSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "processing" } : s))
      );

      await new Promise((r) => setTimeout(r, 500));

      // Run actual logic at appropriate steps
      if (i === 2) calculateRatios();
      if (i === 4) generateDecision();

      setPipelineSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "completed" } : s))
      );
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Workflow Pipeline</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">
        Automated AI credit evaluation pipeline.
      </p>

      {!loanData && (
        <div className="bg-card border border-border rounded-md p-6 mb-6 text-center">
          <p className="text-muted-foreground font-body text-sm mb-4">
            No loan data submitted yet. Please fill in the Loan Application first.
          </p>
          <button
            onClick={() => navigate("/loan-application")}
            className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors"
          >
            Go to Loan Application
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-md p-6 md:p-8">
        <div className="space-y-0">
          {pipelineSteps.map((step, i) => (
            <div key={step.name} className="flex items-center gap-4 py-4 border-b border-border last:border-b-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-medium border border-border bg-background text-muted-foreground">
                {step.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  i + 1
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`font-body text-sm font-medium ${
                    step.status === "completed"
                      ? "text-primary"
                      : step.status === "processing"
                      ? "text-[#FD7E14]"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              <span
                className={`font-body text-xs font-medium uppercase tracking-wider ${
                  step.status === "completed"
                    ? "text-primary"
                    : step.status === "processing"
                    ? "text-[#FD7E14] animate-pulse-brass"
                    : "text-muted-foreground"
                }`}
              >
                {step.status === "processing" ? "Processing..." : step.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={runPipeline}
            disabled={!loanData}
            className="bg-primary text-primary-foreground font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#218838] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Run Pipeline
          </button>
          <button
            onClick={() => navigate("/financial-analysis")}
            className="bg-card text-foreground border border-border font-body font-medium py-2.5 px-6 rounded-md hover:bg-[#DEE2E6] transition-colors"
          >
            View Financial Ratio Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
export default WorkflowPipelinePage;
