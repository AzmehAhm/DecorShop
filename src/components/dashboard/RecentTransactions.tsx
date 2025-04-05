import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  ShoppingCart,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "sale" | "purchase" | "expense" | "payment";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "sale":
      return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    case "purchase":
      return <ArrowDownLeft className="h-4 w-4 text-red-600" />;
    case "expense":
      return <ShoppingCart className="h-4 w-4 text-orange-600" />;
    case "payment":
      return <Package className="h-4 w-4 text-blue-600" />;
    default:
      return null;
  }
};

const RecentTransactions = ({
  transactions = [
    {
      id: "1",
      type: "sale",
      description: "Invoice #1234 - Customer A",
      amount: 1250.0,
      date: "2023-06-15",
      status: "completed",
    },
    {
      id: "2",
      type: "purchase",
      description: "PO #5678 - Supplier B",
      amount: 850.5,
      date: "2023-06-14",
      status: "completed",
    },
    {
      id: "3",
      type: "expense",
      description: "Office Supplies",
      amount: 125.75,
      date: "2023-06-13",
      status: "completed",
    },
    {
      id: "4",
      type: "sale",
      description: "Invoice #1235 - Customer C",
      amount: 750.0,
      date: "2023-06-12",
      status: "pending",
    },
    {
      id: "5",
      type: "payment",
      description: "Payment from Customer D",
      amount: 500.0,
      date: "2023-06-11",
      status: "completed",
    },
  ] as Transaction[],
}: RecentTransactionsProps) => {
  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(transaction.type)}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    {transaction.date}
                  </div>
                </TableCell>
                <TableCell
                  className={
                    transaction.type === "sale" ||
                    transaction.type === "payment"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {transaction.type === "sale" || transaction.type === "payment"
                    ? "+"
                    : "-"}
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(transaction.status)}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
