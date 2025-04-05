import { Suspense, lazy } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import MainLayout from "./components/layout/MainLayout";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { Toaster } from "./components/ui/toaster";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/dashboard/DashboardContent"));
const InventoryModule = lazy(
  () => import("./components/modules/inventory/InventoryModule"),
);
const SalesModule = lazy(
  () => import("./components/modules/sales/SalesModule"),
);
const PurchasesModule = lazy(
  () => import("./components/modules/purchases/PurchasesModule"),
);
const FinancialModule = lazy(
  () => import("./components/modules/financial/FinancialModule"),
);
const ReportsModule = lazy(
  () => import("./components/modules/reports/ReportsModule"),
);
const SettingsModule = lazy(
  () => import("./components/modules/settings/SettingsModule"),
);

function App() {
  // Tempo routes - this is important for storyboards to work
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <CurrencyProvider>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <>
          {/* Render Tempo routes first */}
          {tempoRoutes}

          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryModule />} />
              <Route path="/sales" element={<SalesModule />} />
              <Route path="/purchases" element={<PurchasesModule />} />
              <Route path="/financial" element={<FinancialModule />} />
              <Route path="/reports" element={<ReportsModule />} />
              <Route path="/settings" element={<SettingsModule />} />
              {/* This is a fallback for Tempo routes, but the useRoutes above is the preferred method */}
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Route>
          </Routes>
          <Toaster />
        </>
      </Suspense>
    </CurrencyProvider>
  );
}

export default App;
