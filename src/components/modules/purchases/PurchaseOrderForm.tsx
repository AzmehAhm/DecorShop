import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySelector } from "@/components/ui/currency-selector";

// Form validation schema
const formSchema = z.object({
  supplierName: z.string().min(2, { message: "Supplier name is required" }),
  orderDate: z.string(),
  expectedDeliveryDate: z.string(),
  status: z.string(),
  currency: z.enum(["USD", "SYP"]),
  exchangeRate: z.number().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string().min(2, { message: "Product name is required" }),
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

interface PurchaseOrderFormProps {
  initialData?: FormValues;
  onSubmit?: (data: FormValues) => void;
  isEditing?: boolean;
  onCancel?: () => void;
  order?: any;
}

const PurchaseOrderForm = ({
  initialData,
  onSubmit,
  isEditing = false,
  onCancel = () => {},
  order = null,
}: PurchaseOrderFormProps = {}) => {
  const { defaultExchangeRate, getExchangeRate } = useCurrency();

  // Default form values
  const defaultValues: FormValues = initialData || {
    supplierName: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    status: "draft",
    currency: "USD",
    exchangeRate: undefined,
    notes: "",
    items: [
      {
        productId: "",
        productName: "",
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

  // Mock suppliers data
  const suppliers = [
    { id: "1", name: "Acme Supplies" },
    { id: "2", name: "Global Distribution Co." },
    { id: "3", name: "Tech Parts Inc." },
    { id: "4", name: "Office Solutions Ltd." },
  ];

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

  // Add a new item to the order
  const addItem = () => {
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [
      ...currentItems,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        hasVariants: false,
        variants: [],
        selectedVariantId: "",
      },
    ]);
  };

  // Remove an item from the order
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      );
    }
  };

  // Handle product selection
  const handleProductSelect = (productId: string, index: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const items = form.getValues("items");
      items[index].productId = productId;
      items[index].productName = product.name;

      // If product has variants, show variant selection
      if (product.variants && product.variants.length > 0) {
        items[index].hasVariants = true;
        items[index].variants = product.variants;
        items[index].selectedVariantId = "";
        items[index].unitPrice = 0; // Will be set when variant is selected
      } else {
        // No variants, just set the price
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

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    const currency = form.watch("currency");
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`;
    } else {
      return `£${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // Calculate order total
  const calculateTotal = () => {
    const items = form.getValues("items") || [];
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = (data: FormValues) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form submitted:", data);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Purchase Order" : "Create Purchase Order"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supplier Selection */}
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Date */}
            <FormField
              control={form.control}
              name="orderDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Delivery Date */}
            <FormField
              control={form.control}
              name="expectedDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency Selection */}
            <CurrencySelector
              control={form.control}
              currencyName="currency"
              exchangeRateName="exchangeRate"
            />
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Add products to your purchase order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.watch("items")?.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    {/* Product Selection */}
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>
                              Product
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductSelect(value, index);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
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
                            {form.watch(`items.${index}.hasVariants`) && (
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
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a variant" />
                                    </SelectTrigger>
                                  </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>
                              Quantity
                            </FormLabel>
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
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>
                              Unit Price
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5">
                                  {form.watch("currency") === "USD" ? "$" : "£"}
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
                    </div>

                    {/* Item Total */}
                    <div className="col-span-1 text-right">
                      <FormLabel className={index !== 0 ? "sr-only" : ""}>
                        Total
                      </FormLabel>
                      <div className="h-9 flex items-center justify-end">
                        {formatCurrency(
                          (form.watch(`items.${index}.quantity`) || 0) *
                            (form.watch(`items.${index}.unitPrice`) || 0),
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={form.watch("items").length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Total Items: {form.watch("items")?.length || 0}
              </div>
              <div className="text-xl font-semibold">
                Order Total: {formatCurrency(calculateTotal())}
                {form.watch("currency") === "SYP" && (
                  <div className="text-sm text-muted-foreground">
                    Equivalent: $
                    {(
                      calculateTotal() /
                      getExchangeRate(form.watch("exchangeRate"))
                    ).toFixed(2)}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes or instructions for this purchase order"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include any special instructions for the supplier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderForm;
