import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, Filter } from "lucide-react";

interface StockChange {
  id: string;
  productId: string;
  productName: string;
  date: Date;
  changeType: "increase" | "decrease";
  quantity: number;
  reason: string;
  documentRef?: string;
  user: string;
}

interface StockHistoryProps {
  stockChanges?: StockChange[];
}

const StockHistory = ({ stockChanges = [] }: StockHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);

  // Generate mock data if none provided
  const defaultStockChanges: StockChange[] =
    stockChanges.length > 0
      ? stockChanges
      : [
          {
            id: "1",
            productId: "P001",
            productName: "Laptop Dell XPS 13",
            date: new Date(2023, 5, 15),
            changeType: "increase",
            quantity: 10,
            reason: "Purchase Order #PO-2023-001",
            documentRef: "PO-2023-001",
            user: "John Doe",
          },
          {
            id: "2",
            productId: "P001",
            productName: "Laptop Dell XPS 13",
            date: new Date(2023, 5, 18),
            changeType: "decrease",
            quantity: 2,
            reason: "Sales Invoice #INV-2023-042",
            documentRef: "INV-2023-042",
            user: "Jane Smith",
          },
          {
            id: "3",
            productId: "P002",
            productName: "Wireless Mouse",
            date: new Date(2023, 5, 20),
            changeType: "increase",
            quantity: 50,
            reason: "Purchase Order #PO-2023-003",
            documentRef: "PO-2023-003",
            user: "John Doe",
          },
          {
            id: "4",
            productId: "P003",
            productName: "USB-C Adapter",
            date: new Date(2023, 5, 22),
            changeType: "decrease",
            quantity: 5,
            reason: "Sales Invoice #INV-2023-044",
            documentRef: "INV-2023-044",
            user: "Jane Smith",
          },
          {
            id: "5",
            productId: "P002",
            productName: "Wireless Mouse",
            date: new Date(2023, 5, 25),
            changeType: "decrease",
            quantity: 10,
            reason: "Sales Invoice #INV-2023-046",
            documentRef: "INV-2023-046",
            user: "Jane Smith",
          },
        ];

  // Filter the stock changes based on search term, filter type, and date
  const filteredStockChanges = defaultStockChanges.filter((change) => {
    const matchesSearch =
      change.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "increase" && change.changeType === "increase") ||
      (filterType === "decrease" && change.changeType === "decrease");

    const matchesDate =
      !dateRange ||
      (dateRange &&
        change.date.getFullYear() === dateRange.getFullYear() &&
        change.date.getMonth() === dateRange.getMonth() &&
        change.date.getDate() === dateRange.getDate());

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Stock History</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search by product name, ID or reason"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Changes</SelectItem>
                <SelectItem value="increase">Stock Increases</SelectItem>
                <SelectItem value="decrease">Stock Decreases</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange ? (
                    format(dateRange, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockChanges.length > 0 ? (
                filteredStockChanges.map((change) => (
                  <TableRow key={change.id}>
                    <TableCell>{format(change.date, "MMM dd, yyyy")}</TableCell>
                    <TableCell>{change.productId}</TableCell>
                    <TableCell>{change.productName}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${change.changeType === "increase" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {change.changeType === "increase"
                          ? "Increase"
                          : "Decrease"}
                      </span>
                    </TableCell>
                    <TableCell>{change.quantity}</TableCell>
                    <TableCell>
                      <span className="text-sm">{change.reason}</span>
                      {change.documentRef && (
                        <span className="block text-xs text-muted-foreground">
                          Ref: {change.documentRef}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{change.user}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No stock changes found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockHistory;
