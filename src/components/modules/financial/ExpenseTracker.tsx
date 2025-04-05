import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Plus,
  Search,
  Upload,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  receipt?: string;
  status: "pending" | "approved" | "rejected";
}

const ExpenseTracker = () => {
  const [date, setDate] = useState<Date>();
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      date: new Date(2023, 5, 15),
      category: "Office Supplies",
      description: "Printer paper and ink cartridges",
      amount: 129.99,
      receipt: "receipt-001.jpg",
      status: "approved",
    },
    {
      id: "2",
      date: new Date(2023, 5, 18),
      category: "Travel",
      description: "Client meeting - transportation",
      amount: 45.5,
      receipt: "receipt-002.jpg",
      status: "approved",
    },
    {
      id: "3",
      date: new Date(2023, 5, 20),
      category: "Utilities",
      description: "Internet service - June",
      amount: 89.99,
      status: "pending",
    },
    {
      id: "4",
      date: new Date(2023, 5, 22),
      category: "Marketing",
      description: "Social media advertising",
      amount: 200.0,
      receipt: "receipt-003.jpg",
      status: "rejected",
    },
    {
      id: "5",
      date: new Date(2023, 5, 25),
      category: "Meals",
      description: "Team lunch meeting",
      amount: 78.45,
      receipt: "receipt-004.jpg",
      status: "approved",
    },
  ]);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(true);
  const [isViewExpenseOpen, setIsViewExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const expenseCategories = [
    "Office Supplies",
    "Travel",
    "Utilities",
    "Marketing",
    "Meals",
    "Software",
    "Hardware",
    "Rent",
    "Insurance",
    "Maintenance",
    "Other",
  ];

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewExpenseOpen(true);
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of your expense. All fields marked with * are
                required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="Enter expense description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="receipt">Receipt (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="receipt" type="file" className="hidden" />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("receipt")?.click()
                      }
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Receipt
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddExpenseOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="w-[250px] pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Download size={18} />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {format(expense.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expense.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : expense.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {expense.status.charAt(0).toUpperCase() +
                            expense.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {expense.receipt ? (
                          <Button variant="link" className="p-0 h-auto">
                            View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewExpense(expense)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses
                    .filter((expense) => expense.status === "pending")
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(expense.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {expense.receipt ? (
                            <Button variant="link" className="p-0 h-auto">
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewExpense(expense)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar TabsContent for approved and rejected tabs */}
        <TabsContent value="approved" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses
                    .filter((expense) => expense.status === "approved")
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(expense.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {expense.receipt ? (
                            <Button variant="link" className="p-0 h-auto">
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewExpense(expense)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses
                    .filter((expense) => expense.status === "rejected")
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {format(expense.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {expense.receipt ? (
                            <Button variant="link" className="p-0 h-auto">
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewExpense(expense)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Expense Dialog */}
      <Dialog open={isViewExpenseOpen} onOpenChange={setIsViewExpenseOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedExpense && (
            <>
              <DialogHeader>
                <DialogTitle>Expense Details</DialogTitle>
                <DialogDescription>
                  Viewing details for expense #{selectedExpense.id}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Date
                    </Label>
                    <p>{format(selectedExpense.date, "MMMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Category
                    </Label>
                    <p>{selectedExpense.category}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Description
                  </Label>
                  <p>{selectedExpense.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Amount
                    </Label>
                    <p>${selectedExpense.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Status
                    </Label>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedExpense.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedExpense.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedExpense.status.charAt(0).toUpperCase() +
                        selectedExpense.status.slice(1)}
                    </div>
                  </div>
                </div>
                {selectedExpense.receipt && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Receipt
                    </Label>
                    <div className="mt-2 border rounded-md p-2 bg-gray-50">
                      <img
                        src="https://images.unsplash.com/photo-1572666341285-c8cb9790ca50?w=600&q=80"
                        alt="Receipt"
                        className="w-full h-auto max-h-[200px] object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewExpenseOpen(false)}
                >
                  Close
                </Button>
                <Button variant="default">Edit Expense</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
