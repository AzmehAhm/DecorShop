import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  FileText,
  TrendingUp,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

const MetricCard = ({
  title = "Metric",
  value = "$0",
  description = "No data available",
  icon = <DollarSign className="h-4 w-4" />,
  trend = "neutral",
  trendValue = "0%",
}: MetricCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted/20 p-1.5 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className="mt-3 flex items-center text-xs">
          {trend === "up" ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : trend === "down" ? (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          ) : (
            <TrendingUp className="mr-1 h-4 w-4 text-gray-500" />
          )}
          <span
            className={`${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}
          >
            {trendValue}
          </span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricsOverviewProps {
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
}

const MetricsOverview = ({ metrics }: MetricsOverviewProps) => {
  const defaultMetrics = {
    totalSales: "$24,780",
    inventoryValue: "$89,120",
    outstandingInvoices: "$12,540",
    monthlyRevenue: "$32,450",
    salesTrend: "up" as const,
    salesTrendValue: "12.5%",
    inventoryTrend: "up" as const,
    inventoryTrendValue: "3.2%",
    invoicesTrend: "down" as const,
    invoicesTrendValue: "5.1%",
    revenueTrend: "up" as const,
    revenueTrendValue: "8.4%",
  };

  const data = metrics || defaultMetrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-gray-50 p-4 rounded-lg">
      <MetricCard
        title="Total Sales"
        value={data.totalSales}
        description="Total sales this month"
        icon={<DollarSign className="h-4 w-4" />}
        trend={data.salesTrend}
        trendValue={data.salesTrendValue}
      />
      <MetricCard
        title="Inventory Value"
        value={data.inventoryValue}
        description="Current inventory valuation"
        icon={<Package className="h-4 w-4" />}
        trend={data.inventoryTrend}
        trendValue={data.inventoryTrendValue}
      />
      <MetricCard
        title="Outstanding Invoices"
        value={data.outstandingInvoices}
        description="Unpaid customer invoices"
        icon={<FileText className="h-4 w-4" />}
        trend={data.invoicesTrend}
        trendValue={data.invoicesTrendValue}
      />
      <MetricCard
        title="Monthly Revenue"
        value={data.monthlyRevenue}
        description="Revenue for current month"
        icon={<DollarSign className="h-4 w-4" />}
        trend={data.revenueTrend}
        trendValue={data.revenueTrendValue}
      />
    </div>
  );
};

export default MetricsOverview;
