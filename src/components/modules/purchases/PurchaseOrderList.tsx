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
  Filter,
  Plus,
  FileEdit,
  Trash2,
  Eye,
  FileDown,
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  date: string;
  total: number;
  status: "pending" | "received" | "partial" | "cancelled";
  items: number;
}

interface PurchaseOrderListProps {
  purchaseOrders?: PurchaseOrder[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreateNew?: () => void;
}

const PurchaseOrderList = ({
  purchaseOrders = [
    {
      id: "1",
      orderNumber: "PO-2023-001",
      supplier: "Office Supplies Inc.",
      date: "2023-05-15",
      total: 1250.99,
      status: "pending",
      items: 12,
    },
    {
      id: "2",
      orderNumber: "PO-2023-002",
      supplier: "Tech Solutions Ltd.",
      date: "2023-05-18",
      total: 3499.5,
      status: "received",
      items: 5,
    },
    {
      id: "3",
      orderNumber: "PO-2023-003",
      supplier: "Furniture Depot",
      date: "2023-05-20",
      total: 5750.0,
      status: "partial",
      items: 8,
    },
    {
      id: "4",
      orderNumber: "PO-2023-004",
      supplier: "Global Imports",
      date: "2023-05-22",
      total: 1875.25,
      status: "cancelled",
      items: 15,
    },
    {
      id: "5",
      orderNumber: "PO-2023-005",
      supplier: "Office Supplies Inc.",
      date: "2023-05-25",
      total: 950.75,
      status: "pending",
      items: 7,
    },
  ],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onCreateNew = () => {},
}: PurchaseOrderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter purchase orders based on search term and status filter
  const filteredPurchaseOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "received":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "partial":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          New Purchase Order
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="partial">Partially Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchaseOrders.length > 0 ? (
              filteredPurchaseOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status === "pending" && "Pending"}
                      {order.status === "received" && "Received"}
                      {order.status === "partial" && "Partially Received"}
                      {order.status === "cancelled" && "Cancelled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(order.id)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      {order.status !== "received" &&
                        order.status !== "cancelled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(order.id)}
                            title="Edit Order"
                          >
                            <FileEdit size={16} />
                          </Button>
                        )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(order.id)}
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download PDF">
                        <FileDown size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No purchase orders found matching your filters.
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
    </div>
  );
};

export default PurchaseOrderList;
