import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySelector } from "@/components/ui/currency-selector";

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Customer name is required" }),
  invoiceDate: z.string(),
  dueDate: z.string(),
  currency: z.enum(["USD", "SYP"]),
  exchangeRate: z.number().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z
        .string()
        .min(1, { message: "Product selection is required" }),
      quantity: z.coerce
        .number()
        .min(1, { message: "Quantity must be at least 1" }),
      unitPrice: z.coerce
        .number()
        .min(0.01, { message: "Price must be greater than 0" }),
      hasVariants: z.boolean().optional(),
      variants: z.array(z.any()).optional(),
      selectedVariantId: z.string().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  invoiceId?: string | null;
  initialData?: FormValues;
}

export default function InvoiceForm({
  onSubmit,
  onCancel,
  isEditing = false,
  invoiceId = null,
  initialData,
}: InvoiceFormProps) {
  const { defaultExchangeRate, getExchangeRate } = useCurrency();

  // Fetch products from the database
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const { data } = await import("@/services/productService").then(
          (module) => module.getProducts(),
        );
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection
  const handleProductSelect = (productId: string, index: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const items = form.getValues("items");

      // If product has variants, show variant selection
      if (product.variants && product.variants.length > 0) {
        items[index].productId = productId;
        items[index].hasVariants = true;
        items[index].variants = product.variants;
        items[index].selectedVariantId = "";
        items[index].unitPrice = 0; // Will be set when variant is selected
      } else {
        // No variants, just set the price
        items[index].productId = productId;
        items[index].unitPrice = product.price || 0;
        items[index].hasVariants = false;
        items[index].variants = [];
        items[index].selectedVariantId = "";
      }

      form.setValue("items", items);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variantId: string, index: number) => {
    const items = form.getValues("items");
    const productId = items[index].productId;
    const product = products.find((p) => p.id === productId);

    if (product && product.variants) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        items[index].selectedVariantId = variantId;
        items[index].unitPrice = variant.price || 0;
        form.setValue("items", items);
      }
    }
  };

  // Default form values
  const defaultValues: FormValues = initialData || {
    customerName: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currency: "USD",
    exchangeRate: undefined,
    notes: "",
    items: [
      {
        productId: "",
        quantity: 1,
        unitPrice: 0,
        hasVariants: false,
        variants: [],
        selectedVariantId: "",
      },
    ],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Add a new item to the invoice
  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      {
        productId: "",
        quantity: 1,
        unitPrice: 0,
        hasVariants: false,
        variants: [],
        selectedVariantId: "",
      },
    ]);
  };

  // Remove an item from the invoice
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      );
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    const items = form.getValues("items") || [];
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  // Calculate tax (assuming 10% tax rate)
  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    const currency = form.watch("currency");
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`;
    } else {
      return `£${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // Handle form submission
  const handleSubmit = (data: FormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form submitted:", data);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? `Edit Invoice ${invoiceId}` : "Create New Invoice"}
        </h1>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <CurrencySelector
                  control={form.control}
                  currencyName="currency"
                  exchangeRateName="exchangeRate"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.watch("items")?.map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleProductSelect(value, index);
                                      }}
                                      value={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a product" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {products?.map((product) => (
                                          <SelectItem
                                            key={product.id}
                                            value={product.id}
                                          >
                                            {product.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

                                    {/* Variant Selection */}
                                    {form.watch(
                                      `items.${index}.hasVariants`,
                                    ) && (
                                      <div className="mt-2">
                                        <Select
                                          onValueChange={(value) => {
                                            handleVariantSelect(value, index);
                                          }}
                                          value={
                                            form.watch(
                                              `items.${index}.selectedVariantId`,
                                            ) || ""
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a variant" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {form
                                              .watch(`items.${index}.variants`)
                                              ?.map((variant) => (
                                                <SelectItem
                                                  key={variant.id}
                                                  value={variant.id}
                                                >
                                                  {variant.sizeName || ""}{" "}
                                                  {variant.colorName
                                                    ? `- ${variant.colorName}`
                                                    : ""}{" "}
                                                  (${variant.sku})
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.valueAsNumber);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-2.5">
                                      {form.watch("currency") === "USD"
                                        ? "$"
                                        : "£"}
                                    </span>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="pl-7"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e.target.valueAsNumber);
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            (form.watch(`items.${index}.quantity`) || 0) *
                              (form.watch(`items.${index}.unitPrice`) || 0),
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={form.watch("items").length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={addItem}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>

              <div className="mt-6 flex flex-col items-end">
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>

                  {form.watch("currency") === "SYP" && (
                    <div className="text-sm text-muted-foreground pt-2">
                      <span>Equivalent: </span>
                      <span>
                        $
                        {(
                          calculateTotal() /
                          getExchangeRate(form.watch("exchangeRate"))
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes or payment instructions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Invoice" : "Create Invoice"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
