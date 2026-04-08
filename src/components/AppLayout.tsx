import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="bg-black px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center">
          <Link to="/" className="font-heading text-xl font-semibold text-white tracking-wide">
            Lend Easy
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/loan-application"
            className="hidden md:inline-flex bg-primary text-primary-foreground font-body text-sm font-medium px-5 py-2 rounded-md hover:bg-[#218838] transition-colors"
          >
            Start New Application
          </Link>
          <button
            className="md:hidden text-white p-2 hover:bg-gray-800 rounded-md transition-colors"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-black border-b border-[#222] px-6 py-2 gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 text-sm font-body rounded-md transition-colors whitespace-nowrap ${location.pathname === item.path
                ? "text-primary font-medium"
                : "text-gray-300 hover:text-[#42f56b]"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-[#000000] z-50 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#222]">
          <span className="font-heading text-lg font-semibold text-white">Menu</span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-white p-2 hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-4 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`py-3 px-4 mb-2 text-base font-body rounded-md transition-colors block ${isActive
                    ? "text-[#28A745] bg-[#111] font-medium"
                    : "text-[#FFFFFF] hover:text-[#a3f7b5] hover:bg-[#111]"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-8 border-t border-[#222] pt-6">
            <Link
              to="/loan-application"
              className="bg-primary text-primary-foreground font-body text-center text-sm font-medium w-full py-3 rounded-md hover:bg-[#218838] transition-colors block"
            >
              Start New Application
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 md:py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-[960px]">{children}</div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground font-body">
        <p className="font-semibold">LendEasy – Credit Decision System</p>
        <p className="text-sm text-gray-600">Contact Developers:</p>
        <p className="text-sm">praveenmarappan6@gmail.com</p>
        <p className="text-sm">dr.muhilan2024@gmail.com</p>
      </footer>
    </div>
  );
};

export default AppLayout;
