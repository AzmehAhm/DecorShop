import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  FileText,
  Filter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";

interface DateRange {
  from: Date;
  to?: Date;
}

interface ReportGeneratorProps {
  onExport?: (type: string, format: string) => void;
}

const ReportGenerator = ({ onExport = () => {} }: ReportGeneratorProps) => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");

  // Mock data for reports
  const salesData = [
    {
      id: 1,
      date: "2023-05-01",
      customer: "Acme Inc.",
      amount: 1250.0,
      status: "Paid",
    },
    {
      id: 2,
      date: "2023-05-03",
      customer: "TechSolutions",
      amount: 3450.75,
      status: "Paid",
    },
    {
      id: 3,
      date: "2023-05-07",
      customer: "Global Services",
      amount: 890.5,
      status: "Pending",
    },
    {
      id: 4,
      date: "2023-05-12",
      customer: "Local Shop",
      amount: 450.25,
      status: "Paid",
    },
    {
      id: 5,
      date: "2023-05-18",
      customer: "Mega Corp",
      amount: 5670.0,
      status: "Partially Paid",
    },
  ];

  const inventoryData = [
    {
      id: 1,
      sku: "PRD001",
      name: "Laptop",
      quantity: 15,
      value: 12000.0,
      status: "In Stock",
    },
    {
      id: 2,
      sku: "PRD002",
      name: "Smartphone",
      quantity: 28,
      value: 14000.0,
      status: "In Stock",
    },
    {
      id: 3,
      sku: "PRD003",
      name: "Tablet",
      quantity: 5,
      value: 2500.0,
      status: "Low Stock",
    },
    {
      id: 4,
      sku: "PRD004",
      name: "Monitor",
      quantity: 0,
      value: 0.0,
      status: "Out of Stock",
    },
    {
      id: 5,
      sku: "PRD005",
      name: "Keyboard",
      quantity: 32,
      value: 1600.0,
      status: "In Stock",
    },
  ];

  const financialData = [
    {
      id: 1,
      date: "2023-05-01",
      category: "Sales Revenue",
      amount: 5670.0,
      type: "Income",
    },
    {
      id: 2,
      date: "2023-05-02",
      category: "Rent",
      amount: 1200.0,
      type: "Expense",
    },
    {
      id: 3,
      date: "2023-05-05",
      category: "Utilities",
      amount: 350.75,
      type: "Expense",
    },
    {
      id: 4,
      date: "2023-05-10",
      category: "Sales Revenue",
      amount: 3450.25,
      type: "Income",
    },
    {
      id: 5,
      date: "2023-05-15",
      category: "Salaries",
      amount: 4500.0,
      type: "Expense",
    },
  ];

  const renderReportTable = () => {
    switch (reportType) {
      case "sales":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "inventory":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.value.toFixed(2)}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "financial":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    onExport(reportType, exportFormat);
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
          <CardDescription>
            Generate and view different types of reports with filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="report" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="report">Report View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                  </SelectContent>
                </Select>

                <DatePickerWithRange date={dateRange} setDate={setDateRange} />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          Filter Options
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Customize your report filters
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {reportType === "sales" && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-paid" />
                              <Label htmlFor="filter-paid">Paid Invoices</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-pending" />
                              <Label htmlFor="filter-pending">
                                Pending Invoices
                              </Label>
                            </div>
                          </>
                        )}
                        {reportType === "inventory" && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-low-stock" />
                              <Label htmlFor="filter-low-stock">
                                Low Stock Items
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-out-stock" />
                              <Label htmlFor="filter-out-stock">
                                Out of Stock Items
                              </Label>
                            </div>
                          </>
                        )}
                        {reportType === "financial" && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-income" />
                              <Label htmlFor="filter-income">Income</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="filter-expense" />
                              <Label htmlFor="filter-expense">Expenses</Label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px]"
                />
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="report" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="rounded-md border">{renderReportTable()}</div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing{" "}
                      {reportType === "sales"
                        ? salesData.length
                        : reportType === "inventory"
                          ? inventoryData.length
                          : financialData.length}{" "}
                      entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <BarChart className="h-4 w-4" />
                      Bar Chart
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <LineChart className="h-4 w-4" />
                      Line Chart
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <PieChart className="h-4 w-4" />
                      Pie Chart
                    </Button>
                  </div>
                  <div className="h-[400px] w-full flex items-center justify-center border rounded-md bg-muted/20">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">
                        Select chart type to visualize {reportType} data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
