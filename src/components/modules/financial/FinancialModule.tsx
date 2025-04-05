import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Receipt,
  DollarSign,
  BarChart4,
  Users,
  FileText,
} from "lucide-react";

// Create placeholder components since the actual components don't exist or have issues
const CashRegister = () => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Cash Register</h2>
      <div className="border p-4 rounded-lg">
        <p className="text-muted-foreground">
          Cash register functionality would be implemented here
        </p>
      </div>
    </div>
  );
};

const ExpenseTracker = () => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Expense Tracker</h2>
      <div className="border p-4 rounded-lg">
        <p className="text-muted-foreground">
          Expense tracking functionality would be implemented here
        </p>
      </div>
    </div>
  );
};

const CustomerAccounts = () => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Customer Accounts</h2>
      <div className="border p-4 rounded-lg">
        <p className="text-muted-foreground">
          Customer account management would be implemented here
        </p>
      </div>
    </div>
  );
};

interface FinancialModuleProps {
  activeTab?: string;
}

const FinancialModule = ({ activeTab = "overview" }: FinancialModuleProps) => {
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Mock financial data for overview
  const financialMetrics = [
    {
      title: "Total Revenue",
      value: "$24,567.89",
      change: "+12.5%",
      positive: true,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Outstanding Invoices",
      value: "$5,432.10",
      change: "-3.2%",
      positive: true,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Monthly Expenses",
      value: "$8,765.43",
      change: "+5.7%",
      positive: false,
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Customer Accounts",
      value: "24 Active",
      change: "+2 new",
      positive: true,
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Generate Reports
          </Button>
          <Button>
            <BarChart4 className="mr-2 h-4 w-4" /> Financial Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart4 className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="cash-register" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" /> Cash Register
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center">
            <Receipt className="mr-2 h-4 w-4" /> Expenses
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Customer Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <h3 className="text-2xl font-bold mt-1">
                        {metric.value}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${metric.positive ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.change} from last month
                      </p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      {metric.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Overview of the latest financial activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {item % 2 === 0 ? (
                            <DollarSign className="h-4 w-4" />
                          ) : (
                            <Receipt className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {item % 2 === 0
                              ? "Sales Transaction"
                              : "Expense Payment"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-medium ${item % 2 === 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {item % 2 === 0 ? "+" : "-"}$
                        {(Math.random() * 1000).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>
                  Monthly breakdown of income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-md">
                  <div className="text-center">
                    <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">
                      Financial chart visualization would appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cash-register">
          <CashRegister />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseTracker />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerAccounts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialModule;
