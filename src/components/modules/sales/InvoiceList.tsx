import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  FileText,
  Edit,
  Trash2,
  RefreshCcw,
  Filter,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "partially_paid";
  items: number;
}

interface InvoiceListProps {
  invoices?: Invoice[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onProcessReturn?: (id: string) => void;
}

const InvoiceList = ({
  invoices = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      customer: "Acme Corp",
      date: "2023-05-15",
      amount: 1250.0,
      status: "paid",
      items: 5,
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      customer: "Globex Inc",
      date: "2023-05-18",
      amount: 875.5,
      status: "pending",
      items: 3,
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      customer: "Wayne Enterprises",
      date: "2023-05-10",
      amount: 3200.75,
      status: "overdue",
      items: 8,
    },
    {
      id: "4",
      invoiceNumber: "INV-004",
      customer: "Stark Industries",
      date: "2023-05-20",
      amount: 1750.25,
      status: "partially_paid",
      items: 4,
    },
    {
      id: "5",
      invoiceNumber: "INV-005",
      customer: "Daily Planet",
      date: "2023-05-22",
      amount: 950.0,
      status: "paid",
      items: 2,
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onProcessReturn = () => {},
}: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter invoices based on search term and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      case "partially_paid":
        return <Badge className="bg-blue-500">Partially Paid</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search invoices..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partially_paid">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.items}</TableCell>
                    <TableCell className="text-right">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(invoice.id)}
                          title="View Invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(invoice.id)}
                          title="Edit Invoice"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onProcessReturn(invoice.id)}
                          title="Process Return"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(invoice.id)}
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No invoices found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
