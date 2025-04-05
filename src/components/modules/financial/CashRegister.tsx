import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import {
  DollarSign,
  PlusCircle,
  MinusCircle,
  ArrowRightLeft,
  Receipt,
} from "lucide-react";

type Currency = "USD" | "SYP";
type TransactionType =
  | "sale"
  | "expense"
  | "deposit"
  | "withdrawal"
  | "exchange";

interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  description: string;
  amount: number;
  currency: Currency;
  exchangeRate?: number;
  reference?: string;
}

export default function CashRegister() {
  const { defaultExchangeRate, convertAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState("register");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("sale");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState<string>("");

  // For currency exchange
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("SYP");
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [customRate, setCustomRate] = useState<string>("");

  // Sample transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date(2023, 5, 15, 10, 30),
      type: "sale",
      description: "Invoice #INV-001",
      amount: 250.0,
      currency: "USD",
      reference: "INV-001",
    },
    {
      id: "2",
      date: new Date(2023, 5, 15, 14, 45),
      type: "expense",
      description: "Office supplies",
      amount: 45.75,
      currency: "USD",
    },
    {
      id: "3",
      date: new Date(2023, 5, 16, 9, 15),
      type: "sale",
      description: "Invoice #INV-002",
      amount: 175000,
      currency: "SYP",
      exchangeRate: 3500,
      reference: "INV-002",
    },
    {
      id: "4",
      date: new Date(2023, 5, 16, 16, 30),
      type: "deposit",
      description: "Bank transfer",
      amount: 1000,
      currency: "USD",
    },
    {
      id: "5",
      date: new Date(2023, 5, 17, 11, 0),
      type: "exchange",
      description: "Currency exchange USD to SYP",
      amount: 500,
      currency: "USD",
      exchangeRate: 3550,
    },
  ]);

  // Calculate balances
  const calculateBalance = (currency: Currency) => {
    return transactions
      .filter((t) => t.currency === currency)
      .reduce((total, transaction) => {
        if (transaction.type === "sale" || transaction.type === "deposit") {
          return total + transaction.amount;
        } else if (
          transaction.type === "expense" ||
          transaction.type === "withdrawal"
        ) {
          return total - transaction.amount;
        } else if (transaction.type === "exchange") {
          if (transaction.currency === currency) {
            return total - transaction.amount; // Money going out of this currency
          } else {
            // Money coming into this currency
            const rate = transaction.exchangeRate || defaultExchangeRate;
            return (
              total +
              convertAmount(
                transaction.amount,
                transaction.currency,
                currency,
                rate,
              )
            );
          }
        }
        return total;
      }, 0);
  };

  const usdBalance = calculateBalance("USD");
  const sypBalance = calculateBalance("SYP");

  // Handle transaction submission
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date(),
      type: transactionType,
      description,
      amount: parseFloat(amount),
      currency: selectedCurrency,
      reference: reference || undefined,
    };

    if (selectedCurrency === "SYP" && exchangeRate) {
      newTransaction.exchangeRate = parseFloat(exchangeRate);
    }

    setTransactions([newTransaction, ...transactions]);

    // Reset form
    setAmount("");
    setDescription("");
    setReference("");
    setExchangeRate("");
  };

  // Handle currency exchange
  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !exchangeAmount ||
      isNaN(parseFloat(exchangeAmount)) ||
      parseFloat(exchangeAmount) <= 0
    ) {
      alert("Please enter a valid amount to exchange");
      return;
    }

    const rate = customRate ? parseFloat(customRate) : defaultExchangeRate;
    const amountValue = parseFloat(exchangeAmount);

    // Create two transactions - one for money going out, one for money coming in
    const outgoingTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date(),
      type: "exchange",
      description: `Exchange from ${fromCurrency} to ${toCurrency}`,
      amount: amountValue,
      currency: fromCurrency,
      exchangeRate: rate,
    };

    const convertedAmount = convertAmount(
      amountValue,
      fromCurrency,
      toCurrency,
      rate,
    );

    const incomingTransaction: Transaction = {
      id: (transactions.length + 2).toString(),
      date: new Date(),
      type: "exchange",
      description: `Exchange from ${fromCurrency} to ${toCurrency}`,
      amount: convertedAmount,
      currency: toCurrency,
      exchangeRate: rate,
    };

    setTransactions([
      incomingTransaction,
      outgoingTransaction,
      ...transactions,
    ]);

    // Reset form
    setExchangeAmount("");
    setCustomRate("");
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800";
      case "expense":
        return "bg-red-100 text-red-800";
      case "deposit":
        return "bg-blue-100 text-blue-800";
      case "withdrawal":
        return "bg-orange-100 text-orange-800";
      case "exchange":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Balance Cards */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">USD Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${usdBalance.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              ≈ £
              {(usdBalance * defaultExchangeRate).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              SYP
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">SYP Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              £
              {sypBalance.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ≈ ${(sypBalance / defaultExchangeRate).toFixed(2)} USD
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="exchange">Currency Exchange</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <Select
                      value={transactionType}
                      onValueChange={(value) =>
                        setTransactionType(value as TransactionType)
                      }
                    >
                      <SelectTrigger id="transaction-type">
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={selectedCurrency}
                      onValueChange={(value) =>
                        setSelectedCurrency(value as Currency)
                      }
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="SYP">SYP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">
                        {selectedCurrency === "USD" ? "$" : "£"}
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  {selectedCurrency === "SYP" && (
                    <div className="space-y-2">
                      <Label htmlFor="exchange-rate">
                        Exchange Rate (SYP to USD)
                      </Label>
                      <Input
                        id="exchange-rate"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={`Default: ${defaultExchangeRate}`}
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to use default rate: {defaultExchangeRate}{" "}
                        SYP = 1 USD
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Enter transaction description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference (Optional)</Label>
                    <Input
                      id="reference"
                      placeholder="Invoice or receipt number"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Receipt className="mr-2 h-4 w-4" />
                  Record Transaction
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExchange} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From Currency</Label>
                    <Select
                      value={fromCurrency}
                      onValueChange={(value) => {
                        setFromCurrency(value as Currency);
                        if (value === toCurrency) {
                          setToCurrency(value === "USD" ? "SYP" : "USD");
                        }
                      }}
                    >
                      <SelectTrigger id="from-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="SYP">SYP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-currency">To Currency</Label>
                    <Select
                      value={toCurrency}
                      onValueChange={(value) => {
                        setToCurrency(value as Currency);
                        if (value === fromCurrency) {
                          setFromCurrency(value === "USD" ? "SYP" : "USD");
                        }
                      }}
                    >
                      <SelectTrigger id="to-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="SYP">SYP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exchange-amount">Amount to Exchange</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">
                        {fromCurrency === "USD" ? "$" : "£"}
                      </span>
                      <Input
                        id="exchange-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-7"
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-rate">
                      Exchange Rate{" "}
                      {fromCurrency === "USD" ? "(USD to SYP)" : "(SYP to USD)"}
                    </Label>
                    <Input
                      id="custom-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={`Default: ${defaultExchangeRate}`}
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use default rate: {defaultExchangeRate} SYP
                      = 1 USD
                    </p>
                  </div>
                </div>

                {exchangeAmount && (
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">Exchange Preview</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg font-bold">
                          {fromCurrency === "USD" ? "$" : "£"}
                          {parseFloat(exchangeAmount).toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits:
                                fromCurrency === "USD" ? 2 : 0,
                            },
                          )}
                        </span>
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-bold">
                          {toCurrency === "USD" ? "$" : "£"}
                          {convertAmount(
                            parseFloat(exchangeAmount) || 0,
                            fromCurrency,
                            toCurrency,
                            customRate ? parseFloat(customRate) : undefined,
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: toCurrency === "USD" ? 2 : 0,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate: 1 {fromCurrency} ={" "}
                        {fromCurrency === "USD"
                          ? customRate || defaultExchangeRate
                          : (
                              1 /
                              (parseFloat(customRate) || defaultExchangeRate)
                            ).toFixed(6)}{" "}
                        {toCurrency}
                      </p>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Complete Exchange
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {transaction.date.toLocaleDateString()}{" "}
                          {transaction.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getTransactionTypeColor(
                              transaction.type,
                            )}
                          >
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <CurrencyDisplay
                            amount={transaction.amount}
                            currency={transaction.currency}
                            exchangeRate={transaction.exchangeRate}
                            showConversion={true}
                          />
                        </TableCell>
                        <TableCell>{transaction.reference || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
