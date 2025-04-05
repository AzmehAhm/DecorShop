import React, { useState, useEffect } from "react";
import ModifierManager from "./ModifierManager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Save,
  X,
  Plus,
  Trash2,
  Settings,
  Tag,
  Search,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductModifier } from "@/types/product";

interface ProductVariantFormData {
  id?: string;
  sku: string;
  sizeId?: string;
  colorId?: string;
  stockLevel: number;
  reorderPoint: number;
}

interface ProductFormProps {
  product?: {
    id?: string;
    name: string;
    description: string;
    category: string;
    cost: number;
    isActive: boolean;
    imageUrl?: string;
    hasSizeModifier?: boolean;
    hasColorModifier?: boolean;
  };
  onSave?: (product: any) => void;
  onCancel?: () => void;
}

const ProductForm = ({
  product = {
    name: "",
    description: "",
    category: "general",
    cost: 0,
    isActive: true,
    imageUrl: "",
    hasSizeModifier: true, // All products have sizes by default
    hasColorModifier: false,
  },
  onSave = () => {},
  onCancel = () => {},
}: ProductFormProps) => {
  const [formData, setFormData] = useState(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [isModifierDialogOpen, setIsModifierDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // State for modifiers with just one default size value
  const [allModifiers, setAllModifiers] = useState<ProductModifier[]>([
    {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Standard",
      type: "size",
    },
  ]);

  // Derived state for size and color modifiers
  const sizeModifiers = allModifiers.filter((mod) => mod.type === "size");
  const colorModifiers = allModifiers.filter((mod) => mod.type === "color");

  // State for product variants
  const [variants, setVariants] = useState<ProductVariantFormData[]>([]);

  // Generate variants when modifiers change or when component mounts
  useEffect(() => {
    if (formData.hasSizeModifier) {
      // Call the variant generation logic
      const newVariants: ProductVariantFormData[] = [];
      const existingVariantMap = new Map(
        variants.map((v) => [`${v.sizeId || ""}-${v.colorId || ""}`, v]),
      );

      // Generate all combinations of size and color
      sizeModifiers.forEach((size) => {
        if (formData.hasColorModifier && colorModifiers.length > 0) {
          colorModifiers.forEach((color) => {
            const key = `${size.id}-${color.id}`;
            const existing = existingVariantMap.get(key);

            if (existing) {
              newVariants.push(existing);
            } else {
              // Create a new variant with default values
              const variantId = crypto.randomUUID
                ? crypto.randomUUID()
                : "10000000-1000-4000-8000-" +
                  (
                    "000000000000" +
                    Math.floor(Math.random() * 1000000).toString()
                  ).slice(-12);

              newVariants.push({
                id: variantId,
                sku: generateSku(formData.name, size.name, color.name),
                sizeId: size.id,
                colorId: color.id,
                stockLevel: 0,
                reorderPoint: 5,
              });
            }
          });
        } else {
          // Only size variants
          const key = `${size.id}-`;
          const existing = existingVariantMap.get(key);

          if (existing) {
            newVariants.push(existing);
          } else {
            // Create a new variant with default values and a proper UUID
            const variantId = crypto.randomUUID
              ? crypto.randomUUID()
              : "10000000-1000-4000-8000-" +
                (
                  "000000000000" +
                  Math.floor(Math.random() * 1000000).toString()
                ).slice(-12);

            newVariants.push({
              id: variantId,
              sku: generateSku(formData.name, size.name),
              sizeId: size.id,
              stockLevel: 0,
              reorderPoint: 5,
            });
          }
        }
      });

      setVariants(newVariants);
    }
  }, [formData.hasSizeModifier, formData.hasColorModifier, allModifiers]);

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (formData.cost < 0) {
      newErrors.cost = "Cost cannot be negative";
    }

    // Validate variants
    if (variants.length === 0) {
      newErrors.variants = "At least one product variant is required";
    } else {
      const hasInvalidVariant = variants.some((variant) => !variant.sku.trim());
      if (hasInvalidVariant) {
        newErrors.variants = "All variants must have a valid SKU";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Combine product data with variants
      const productData = {
        ...formData,
        variants,
      };
      onSave(productData);
    }
  };

  // Generate variants based on selected modifiers
  const generateVariants = () => {
    if (!formData.hasSizeModifier || sizeModifiers.length === 0) return;

    const newVariants: ProductVariantFormData[] = [];
    const existingVariantMap = new Map(
      variants.map((v) => [`${v.sizeId || ""}-${v.colorId || ""}`, v]),
    );

    // Generate all combinations of size and color
    sizeModifiers.forEach((size) => {
      if (formData.hasColorModifier && colorModifiers.length > 0) {
        colorModifiers.forEach((color) => {
          const key = `${size.id}-${color.id}`;
          const existing = existingVariantMap.get(key);

          if (existing) {
            newVariants.push(existing);
          } else {
            // Create a new variant with default values
            const variantId = crypto.randomUUID
              ? crypto.randomUUID()
              : "10000000-1000-4000-8000-" +
                (
                  "000000000000" +
                  Math.floor(Math.random() * 1000000).toString()
                ).slice(-12);

            newVariants.push({
              id: variantId,
              sku: generateSku(formData.name, size.name, color.name),
              sizeId: size.id,
              colorId: color.id,
              stockLevel: 0,
              reorderPoint: 5,
              price: 0,
            });
          }
        });
      } else {
        // Only size variants
        const key = `${size.id}-`;
        const existing = existingVariantMap.get(key);

        if (existing) {
          newVariants.push(existing);
        } else {
          // Create a new variant with default values and a proper UUID
          const variantId = crypto.randomUUID
            ? crypto.randomUUID()
            : "10000000-1000-4000-8000-" +
              (
                "000000000000" + Math.floor(Math.random() * 1000000).toString()
              ).slice(-12);

          newVariants.push({
            id: variantId,
            sku: generateSku(formData.name, size.name),
            sizeId: size.id,
            stockLevel: 0,
            reorderPoint: 5,
            price: 0,
          });
        }
      }
    });

    setVariants(newVariants);
  };

  // Generate SKU based on product name and modifiers
  const generateSku = (
    productName: string,
    sizeName: string,
    colorName?: string,
  ) => {
    const productPrefix = productName
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .substring(0, 4);
    const sizeCode = sizeName.substring(0, 1).toUpperCase();
    const colorCode = colorName
      ? `-${colorName.substring(0, 3).toUpperCase()}`
      : "";

    return `${productPrefix}-${sizeCode}${colorCode}`;
  };

  // Update a specific variant
  const updateVariant = (
    index: number,
    field: keyof ProductVariantFormData,
    value: any,
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setVariants(updatedVariants);
  };

  // Get size name by ID
  const getSizeName = (sizeId?: string) => {
    if (!sizeId) return "";
    const size = sizeModifiers.find((s) => s.id === sizeId);
    return size ? size.name : "";
  };

  // Get color name by ID
  const getColorName = (colorId?: string) => {
    if (!colorId) return "";
    const color = colorModifiers.find((c) => c.id === colorId);
    return color ? color.name : "";
  };

  // Filter variants based on search term
  const filteredVariants = variants.filter((variant) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      variant.sku.toLowerCase().includes(searchLower) ||
      getSizeName(variant.sizeId).toLowerCase().includes(searchLower) ||
      (variant.colorId &&
        getColorName(variant.colorId).toLowerCase().includes(searchLower))
    );
  });

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {product.id ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="variants">Product Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      {/* Categories will be loaded from settings */}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Categories can be managed in Settings
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Base Cost Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) =>
                        handleChange("cost", parseFloat(e.target.value) || 0)
                      }
                      className={`pl-7 ${errors.cost ? "border-red-500" : ""}`}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {errors.cost && (
                    <p className="text-sm text-red-500 mt-1">{errors.cost}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium">Product Modifiers</h3>
                  <Separator />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasSizeModifier"
                        checked={formData.hasSizeModifier}
                        onCheckedChange={(checked) =>
                          handleChange("hasSizeModifier", checked)
                        }
                        disabled={true} // All products must have sizes
                      />
                      <Label htmlFor="hasSizeModifier">
                        Product has size variants
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsModifierDialogOpen(true)}
                    >
                      <Settings className="h-4 w-4 mr-2" /> Manage Modifiers
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All products must have size variants
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasColorModifier"
                      checked={formData.hasColorModifier}
                      onCheckedChange={(checked) =>
                        handleChange("hasColorModifier", checked)
                      }
                    />
                    <Label htmlFor="hasColorModifier">
                      Product has color variants
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleChange("isActive", checked)
                      }
                    />
                    <Label htmlFor="isActive">
                      Product is active and available for sale
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              {errors.variants && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                  <p>{errors.variants}</p>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Product Variants ({variants.length})
                </h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search variants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Force regeneration of variants regardless of conditions
                      const newVariants: ProductVariantFormData[] = [];
                      const existingVariantMap = new Map(
                        variants.map((v) => [
                          `${v.sizeId || ""}-${v.colorId || ""}`,
                          v,
                        ]),
                      );

                      // Generate all combinations of size and color
                      sizeModifiers.forEach((size) => {
                        if (
                          formData.hasColorModifier &&
                          colorModifiers.length > 0
                        ) {
                          colorModifiers.forEach((color) => {
                            const key = `${size.id}-${color.id}`;
                            const existing = existingVariantMap.get(key);

                            if (existing) {
                              newVariants.push(existing);
                            } else {
                              // Create a new variant with default values
                              const variantId = crypto.randomUUID
                                ? crypto.randomUUID()
                                : "10000000-1000-4000-8000-" +
                                  (
                                    "000000000000" +
                                    Math.floor(
                                      Math.random() * 1000000,
                                    ).toString()
                                  ).slice(-12);

                              newVariants.push({
                                id: variantId,
                                sku: generateSku(
                                  formData.name,
                                  size.name,
                                  color.name,
                                ),
                                sizeId: size.id,
                                colorId: color.id,
                                stockLevel: 0,
                                reorderPoint: 5,
                              });
                            }
                          });
                        } else {
                          // Only size variants
                          const key = `${size.id}-`;
                          const existing = existingVariantMap.get(key);

                          if (existing) {
                            newVariants.push(existing);
                          } else {
                            // Create a new variant with default values and a proper UUID
                            const variantId = crypto.randomUUID
                              ? crypto.randomUUID()
                              : "10000000-1000-4000-8000-" +
                                (
                                  "000000000000" +
                                  Math.floor(Math.random() * 1000000).toString()
                                ).slice(-12);

                            newVariants.push({
                              id: variantId,
                              sku: generateSku(formData.name, size.name),
                              sizeId: size.id,
                              stockLevel: 0,
                              reorderPoint: 5,
                            });
                          }
                        }
                      });

                      setVariants(newVariants);
                    }}
                  >
                    <Tag className="h-4 w-4 mr-2" /> Regenerate Variants
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Size</TableHead>
                      {formData.hasColorModifier && (
                        <TableHead>Color</TableHead>
                      )}
                      <TableHead>Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVariants.length > 0 ? (
                      filteredVariants.map((variant, index) => {
                        // Find the original index in the variants array
                        const originalIndex = variants.findIndex(
                          (v) => v.id === variant.id,
                        );
                        return (
                          <TableRow key={variant.id || index}>
                            <TableCell>
                              <Input
                                value={variant.sku}
                                onChange={(e) =>
                                  updateVariant(
                                    originalIndex,
                                    "sku",
                                    e.target.value,
                                  )
                                }
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>{getSizeName(variant.sizeId)}</TableCell>
                            {formData.hasColorModifier && (
                              <TableCell>
                                {getColorName(variant.colorId)}
                              </TableCell>
                            )}
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={variant.stockLevel}
                                onChange={(e) =>
                                  updateVariant(
                                    originalIndex,
                                    "stockLevel",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={variant.reorderPoint}
                                onChange={(e) =>
                                  updateVariant(
                                    originalIndex,
                                    "reorderPoint",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                className="w-20"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={formData.hasColorModifier ? 5 : 4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          {searchTerm
                            ? "No variants match your search"
                            : "No variants available. Select modifiers in the Basic Information tab."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Product
          </Button>
        </CardFooter>
      </form>

      {/* Modifiers Management Dialog */}
      <Dialog
        open={isModifierDialogOpen}
        onOpenChange={setIsModifierDialogOpen}
      >
        <DialogContent className="max-w-4xl p-0">
          <ModifierManager
            initialModifiers={allModifiers}
            onModifiersChange={setAllModifiers}
            onClose={() => setIsModifierDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductForm;
