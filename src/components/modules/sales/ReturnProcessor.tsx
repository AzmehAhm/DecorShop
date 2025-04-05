import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Check, PackageCheck, RefreshCcw, X } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  invoiceId: z.string().min(1, { message: "Invoice ID is required" }),
  returnReason: z.string().min(1, { message: "Return reason is required" }),
  returnItems: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().min(1),
        returnCondition: z.enum(["new", "damaged", "opened", "defective"]),
      }),
    )
    .min(1, { message: "At least one item must be returned" }),
  refundMethod: z.enum(["credit", "original_payment", "store_credit"]),
  notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof formSchema>;

interface ReturnProcessorProps {
  onComplete?: (data: ReturnFormValues) => void;
  onCancel?: () => void;
  initialInvoiceId?: string;
}

const ReturnProcessor = ({
  onComplete = () => {},
  onCancel = () => {},
  initialInvoiceId = "",
}: ReturnProcessorProps) => {
  const [step, setStep] = useState<
    "invoice" | "items" | "refund" | "confirmation"
  >("invoice");
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Mock invoice data for demonstration
  const mockInvoiceData = {
    id: "INV-2023-0042",
    customer: "Jane Smith",
    date: "2023-05-15",
    items: [
      { id: "P001", name: "Office Chair", price: 199.99, quantity: 2 },
      { id: "P002", name: "Desk Lamp", price: 45.5, quantity: 1 },
      { id: "P003", name: "Notebook Set", price: 12.99, quantity: 3 },
    ],
    total: 471.46,
  };

  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceId: initialInvoiceId,
      returnReason: "",
      returnItems: [],
      refundMethod: "original_payment",
      notes: "",
    },
  });

  const handleInvoiceSearch = () => {
    // In a real app, this would fetch invoice data from an API
    setInvoiceData(mockInvoiceData);
    setStep("items");
  };

  const handleAddReturnItems = (selectedItems: any[]) => {
    form.setValue("returnItems", selectedItems);
    setStep("refund");
  };

  const handleSubmitReturn = (data: ReturnFormValues) => {
    // Process the return and update inventory/financial records
    console.log("Processing return:", data);
    setStep("confirmation");
    onComplete(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl">Process Return</CardTitle>
        <CardDescription>
          Handle customer returns, update inventory, and process refunds
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {step === "invoice" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter invoice number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Reason</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damaged">
                              Damaged Product
                            </SelectItem>
                            <SelectItem value="wrong_item">
                              Wrong Item Received
                            </SelectItem>
                            <SelectItem value="defective">
                              Defective Product
                            </SelectItem>
                            <SelectItem value="not_needed">
                              No Longer Needed
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={handleInvoiceSearch}
                  className="mt-4"
                >
                  Find Invoice
                </Button>
              </div>
            )}

            {step === "items" && invoiceData && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md mb-4">
                  <h3 className="font-medium">Invoice #{invoiceData.id}</h3>
                  <p className="text-sm">Customer: {invoiceData.customer}</p>
                  <p className="text-sm">Date: {invoiceData.date}</p>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Return</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Qty</th>
                        <th className="px-4 py-2 text-left">Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item: any, index: number) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              className="w-16"
                              defaultValue="1"
                              min="1"
                              max={item.quantity}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Select defaultValue="new">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New/Unused</SelectItem>
                                <SelectItem value="opened">Opened</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                                <SelectItem value="defective">
                                  Defective
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("invoice")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // In a real app, this would collect the selected items
                      const mockSelectedItems = [
                        {
                          productId: "P001",
                          productName: "Office Chair",
                          quantity: 1,
                          returnCondition: "damaged",
                        },
                      ];
                      handleAddReturnItems(mockSelectedItems);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === "refund" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Refund Details</h3>

                <FormField
                  control={form.control}
                  name="refundMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refund Method</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select refund method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="original_payment">
                              Original Payment Method
                            </SelectItem>
                            <SelectItem value="store_credit">
                              Store Credit
                            </SelectItem>
                            <SelectItem value="credit">
                              Credit to Account
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes about this return"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">Return Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Items to Return:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Refund Amount:</span>
                      <span>$199.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Restocking Fee:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Refund:</span>
                      <span>$199.99</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("items")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => form.handleSubmit(handleSubmitReturn)()}
                  >
                    Process Return
                  </Button>
                </div>
              </div>
            )}

            {step === "confirmation" && (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Return Processed Successfully
                </h3>
                <p className="text-muted-foreground mb-6">
                  The inventory has been updated and the refund has been
                  processed.
                </p>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={onCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      form.reset();
                      setStep("invoice");
                      setInvoiceData(null);
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Process Another Return
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReturnProcessor;
