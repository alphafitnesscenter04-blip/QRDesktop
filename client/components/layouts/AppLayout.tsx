import { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { QrCode, BarChart3, Home } from "lucide-react";

export default function AppLayout({ children }: PropsWithChildren<{}>) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                α
              </div>
              <div>
                <div className="text-lg font-bold">Alpha Fitness</div>
                <div className="text-xs text-muted-foreground">QR Management System</div>
              </div>
            </div>
          </div>

          <nav className="flex gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Scanner</span>
            </Link>
            <Link
              to="/attendance"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive("/attendance")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-background/50">
        © {new Date().getFullYear()} Alpha Fitness QR Management System • Desktop v1.0
      </footer>
    </div>
  );
}
