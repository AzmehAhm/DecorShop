import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface SalesDataPoint {
  name: string;
  sales: number;
  target: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
  title?: string;
  description?: string;
}

const defaultData: SalesDataPoint[] = [
  { name: "Jan", sales: 4000, target: 4500 },
  { name: "Feb", sales: 3000, target: 3500 },
  { name: "Mar", sales: 5000, target: 4500 },
  { name: "Apr", sales: 2780, target: 3000 },
  { name: "May", sales: 1890, target: 2000 },
  { name: "Jun", sales: 2390, target: 2500 },
  { name: "Jul", sales: 3490, target: 3000 },
  { name: "Aug", sales: 4000, target: 3500 },
  { name: "Sep", sales: 3000, target: 3000 },
  { name: "Oct", sales: 2000, target: 2500 },
  { name: "Nov", sales: 2780, target: 3000 },
  { name: "Dec", sales: 4890, target: 4000 },
];

const SalesChart: React.FC<SalesChartProps> = ({
  data = defaultData,
  title = "Sales Overview",
  description = "View your sales performance over time",
}) => {
  const [period, setPeriod] = useState("yearly");
  const [chartType, setChartType] = useState("bar");

  // Filter data based on selected period
  const getFilteredData = () => {
    if (period === "quarterly") {
      return data.slice(0, 3); // Just show first quarter for demo
    } else if (period === "monthly") {
      return data.slice(0, 1); // Just show first month for demo
    }
    return data; // yearly - show all
  };

  const filteredData = getFilteredData();

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="bar"
          className="w-full"
          onValueChange={setChartType}
        >
          <TabsList className="grid w-[200px] grid-cols-2 mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" name="Sales" />
                <Bar dataKey="target" fill="#94a3b8" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="line" className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  name="Target"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
