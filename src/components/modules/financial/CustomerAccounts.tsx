import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  FileText,
  CreditCard,
  DollarSign,
  UserRound,
  History,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import { getCustomers, CustomerWithBalance } from "@/services/customerService";
import { useToast } from "@/components/ui/use-toast";

interface Transaction {
  id: string;
  customerId: string;
  date: string;
  type: "payment" | "invoice" | "refund";
  amount: number;
  description: string;
  reference: string;
}

const CustomerAccounts = () => {
  const { toast } = useToast();

  // Fetch customers from Supabase
  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery(getCustomers);

  // Mock data for transactions (will be replaced with real data later)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "t1",
      customerId: "1",
      date: "2023-06-15",
      type: "payment",
      amount: 500.0,
      description: "Partial payment for invoice #INV-2023-056",
      reference: "PMT-2023-089",
    },
    {
      id: "t2",
      customerId: "1",
      date: "2023-06-01",
      type: "invoice",
      amount: 1750.0,
      description: "Monthly supplies order",
      reference: "INV-2023-056",
    },
    {
      id: "t3",
      customerId: "2",
      date: "2023-05-22",
      type: "invoice",
      amount: 3750.5,
      description: "Equipment purchase",
      reference: "INV-2023-048",
    },
    {
      id: "t4",
      customerId: "3",
      date: "2023-06-10",
      type: "payment",
      amount: 1200.0,
      description: "Full payment for invoice #INV-2023-052",
      reference: "PMT-2023-085",
    },
    {
      id: "t5",
      customerId: "4",
      date: "2023-06-05",
      type: "invoice",
      amount: 875.25,
      description: "IT services",
      reference: "INV-2023-054",
    },
    {
      id: "t6",
      customerId: "5",
      date: "2023-04-30",
      type: "refund",
      amount: 75.5,
      description: "Refund for returned items",
      reference: "REF-2023-012",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithBalance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");

  // Filter customers based on search term
  const filteredCustomers = customers
    ? customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false),
      )
    : [];

  // Get transactions for selected customer
  const customerTransactions = selectedCustomer
    ? transactions.filter(
        (transaction) => transaction.customerId === selectedCustomer.id,
      )
    : [];

  // Handle customer selection
  const handleSelectCustomer = (customer: CustomerWithBalance) => {
    setSelectedCustomer(customer);
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (!selectedCustomer || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount)) return;

    // Create new transaction
    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      customerId: selectedCustomer.id,
      date: new Date().toISOString().split("T")[0],
      type: "payment",
      amount,
      description:
        paymentDescription || `Payment received from ${selectedCustomer.name}`,
      reference:
        paymentReference ||
        `PMT-${new Date().getFullYear()}-${transactions.length + 1}`,
    };

    // Update transactions
    setTransactions([newTransaction, ...transactions]);

    // In a real app, we would update the customer balance in the database here
    // For now, we'll just update the local state
    if (selectedCustomer) {
      setSelectedCustomer({
        ...selectedCustomer,
        balance: selectedCustomer.balance - amount,
        lastTransaction: newTransaction.date,
      });
    }

    // Reset form
    setPaymentAmount("");
    setPaymentReference("");
    setPaymentDescription("");
    setIsPaymentDialogOpen(false);

    toast({
      title: "Payment recorded",
      description: `Payment of $${amount.toFixed(2)} has been recorded for ${selectedCustomer.name}.`,
    });
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: CustomerWithBalance["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Customers</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Accounts</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              Manage customer accounts and balances
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading customers...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? "bg-primary/10" : "hover:bg-muted"}`}
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.email || "No email"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${customer.balance > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            ${customer.balance.toFixed(2)}
                          </p>
                          <div className="mt-1">
                            {renderStatusBadge(customer.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No customers found
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details and Transactions */}
        <Card className="md:col-span-2">
          {selectedCustomer ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCustomer.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center space-x-4">
                        <span>{selectedCustomer.email || "No email"}</span>
                        <span>{selectedCustomer.phone || "No phone"}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">Balance</p>
                    <p
                      className={`text-2xl font-bold ${selectedCustomer.balance > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      ${selectedCustomer.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Dialog
                    open={isPaymentDialogOpen}
                    onOpenChange={setIsPaymentDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <CreditCard className="mr-2 h-4 w-4" /> Process Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Process Payment</DialogTitle>
                        <DialogDescription>
                          Record a payment for {selectedCustomer.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="amount" className="text-right">
                            Amount
                          </Label>
                          <div className="col-span-3 relative">
                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="amount"
                              placeholder="0.00"
                              className="pl-8"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reference" className="text-right">
                            Reference
                          </Label>
                          <Input
                            id="reference"
                            placeholder="PMT-2023-001"
                            className="col-span-3"
                            value={paymentReference}
                            onChange={(e) =>
                              setPaymentReference(e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            placeholder="Payment for invoice #..."
                            className="col-span-3"
                            value={paymentDescription}
                            onChange={(e) =>
                              setPaymentDescription(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsPaymentDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handlePaymentSubmit}>
                          Record Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" /> View Invoices
                  </Button>
                  <Button variant="outline">
                    <UserRound className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="transactions">
                  <TabsList className="mb-4">
                    <TabsTrigger value="transactions">
                      <History className="mr-2 h-4 w-4" /> Transaction History
                    </TabsTrigger>
                    <TabsTrigger value="statements">
                      <FileText className="mr-2 h-4 w-4" /> Statements
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="transactions">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerTransactions.length > 0 ? (
                          customerTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${transaction.type === "payment" ? "bg-green-500" : transaction.type === "refund" ? "bg-blue-500" : "bg-gray-500"}`}
                                >
                                  {transaction.type.charAt(0).toUpperCase() +
                                    transaction.type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{transaction.reference}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className="text-right font-medium">
                                <span
                                  className={
                                    transaction.type === "invoice"
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }
                                >
                                  {transaction.type === "invoice" ? "-" : "+"}$
                                  {transaction.amount.toFixed(2)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-4 text-muted-foreground"
                            >
                              No transactions found for this customer
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="statements">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No Statements Available
                      </h3>
                      <p>
                        Customer statements will appear here once generated.
                      </p>
                      <Button className="mt-4">Generate Statement</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
              <UserRound className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Customer Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a customer from the list to view their account details,
                transaction history, and manage their balance.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CustomerAccounts;
