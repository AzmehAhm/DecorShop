import React from "react";
import MetricsOverview from "./MetricsOverview";
import SalesChart from "./SalesChart";
import InventoryStatus from "./InventoryStatus";
import RecentTransactions from "./RecentTransactions";

interface DashboardContentProps {
  metrics?: {
    totalSales: string;
    inventoryValue: string;
    outstandingInvoices: string;
    monthlyRevenue: string;
    salesTrend: "up" | "down" | "neutral";
    salesTrendValue: string;
    inventoryTrend: "up" | "down" | "neutral";
    inventoryTrendValue: string;
    invoicesTrend: "up" | "down" | "neutral";
    invoicesTrendValue: string;
    revenueTrend: "up" | "down" | "neutral";
    revenueTrendValue: string;
  };
  salesData?: Array<{
    name: string;
    sales: number;
    target: number;
  }>;
  lowStockItems?: Array<{
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    category: string;
    sales: number;
  }>;
  topSellingItems?: Array<{
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    category: string;
    sales: number;
  }>;
  transactions?: Array<{
    id: string;
    type: "sale" | "purchase" | "expense" | "payment";
    description: string;
    amount: number;
    date: string;
    status: "completed" | "pending" | "cancelled";
  }>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  metrics,
  salesData,
  lowStockItems,
  topSellingItems,
  transactions,
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Metrics Overview Section */}
      <MetricsOverview metrics={metrics} />

      {/* Charts and Inventory Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes up 2/3 of the row on large screens */}
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>

        {/* Inventory Status - Takes up 1/3 of the row on large screens */}
        <div>
          <InventoryStatus
            lowStockItems={lowStockItems}
            topSellingItems={topSellingItems}
          />
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardContent;
