import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Loan Application", path: "/loan-application" },
  { label: "Workflow Pipeline", path: "/workflow-pipeline" },
  { label: "Financial Analysis", path: "/financial-analysis" },
  { label: "Credit Decision", path: "/credit-decision" },
  { label: "CAM Report", path: "/cam-report" },
  { label: "EMI Calculator", path: "/emi-calculator" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
        <Link to="/" className="font-heading text-xl font-semibold text-white tracking-wide">
          Lend Easy
        </Link>
        <Link
          to="/loan-application"
          className="bg-primary text-primary-foreground font-body text-sm font-medium px-5 py-2 rounded-md hover:bg-[#218838] transition-colors"
        >
          Start New Application
        </Link>
      </header>

      <nav className="bg-black border-b border-[#222] px-6 py-2 flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 text-sm font-body rounded-md transition-colors whitespace-nowrap ${
              location.pathname === item.path
                ? "text-primary font-medium"
                : "text-gray-300 hover:text-[#42f56b]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 py-10 px-6">
        <div className="mx-auto max-w-[960px]">{children}</div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground font-body">
        Credit Decision Engine with CAM Generation
      </footer>
    </div>
  );
};

export default AppLayout;
