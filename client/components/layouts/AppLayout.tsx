import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-500"></div>
            <span className="text-xl font-bold">Alpha Fitness QR</span>
          </div>
          <div className="text-sm text-muted-foreground">Desktop QR Scanner</div>
        </div>
      </header>

      <main className="container mx-auto py-10">{children}</main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Alpha Fitness</footer>
    </div>
  );
}
