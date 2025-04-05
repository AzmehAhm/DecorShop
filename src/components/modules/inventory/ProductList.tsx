import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  Tag,
  Loader2,
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import { getProducts, deleteProduct } from "@/services/productService";
import { Product, ProductVariant } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onAdd?: () => void;
  onSelectProduct?: (product: Product | null) => void;
}

const ProductList = ({
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
  onSelectProduct = () => {},
}: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirmProduct, setDeleteConfirmProduct] =
    useState<Product | null>(null);
  const [isVariantsDialogOpen, setIsVariantsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Fetch products from Supabase
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery(getProducts);

  // Delete product mutation
  const { mutate: deleteProductMutation, isLoading: isDeleting } =
    useSupabaseMutation(deleteProduct, {
      onSuccess: () => {
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
        refetch();
      },
      onError: (error) => {
        console.error("Delete product error:", error);
        toast({
          title: "Error",
          description: `Failed to delete product: ${error.message}`,
          variant: "destructive",
        });
      },
    });

  // Get unique categories for filter dropdown
  const categories = [
    "All",
    ...new Set(
      products
        ?.map((product) => product.category || "Uncategorized")
        .filter(Boolean),
    ),
  ];

  // Filter products based on search term and filters
  const filteredProducts = products
    ? products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.variants?.some((v) =>
            v.sku.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ??
            false);

        const matchesCategory =
          categoryFilter === "All" || product.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" || product.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewVariants = (product: Product) => {
    setSelectedProduct(product);
    setIsVariantsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmProduct) {
      deleteProductMutation(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    onEdit(product);
    onSelectProduct(product);
  };

  if (error) {
    return (
      <Card className="w-full bg-white">
        <CardContent className="p-6">
          <div className="text-center py-6 text-red-500">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Error loading products</h3>
            <p className="mt-2">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Inventory Products</CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading products...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {product.name}
                        {product.variants && product.variants.length > 0 && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {product.variants.length} variants
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.variants && product.variants.length > 0
                        ? product.variants[0].sku
                        : "N/A"}
                    </TableCell>
                    <TableCell>{product.category || "Uncategorized"}</TableCell>
                    <TableCell className="text-right">
                      ${product.price?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.cost?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.variants
                        ? product.variants.reduce(
                            (sum, v) => sum + (v.stock_level || 0),
                            0,
                          )
                        : 0}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(product.status || "")}
                      >
                        {product.status === "Low Stock" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {product.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewVariants(product)}
                          title="View Variants"
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmProduct(product)}
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmProduct}
          onOpenChange={(open) => !open && setDeleteConfirmProduct(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-2 text-amber-600 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Warning</span>
              </div>
              <p>
                Are you sure you want to delete the product "
                {deleteConfirmProduct?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. All variants and inventory data
                will be permanently removed.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmProduct(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Variants Dialog */}
        <Dialog
          open={isVariantsDialogOpen}
          onOpenChange={setIsVariantsDialogOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProduct?.name} - Variants</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProduct &&
                  selectedProduct.variants &&
                  selectedProduct.variants.length > 0 ? (
                    selectedProduct.variants.map((variant: ProductVariant) => {
                      // Determine variant status
                      let status = "In Stock";
                      if (variant.stock_level === 0) {
                        status = "Out of Stock";
                      } else if (
                        variant.stock_level <= (variant.reorder_point || 0)
                      ) {
                        status = "Low Stock";
                      }

                      return (
                        <TableRow key={variant.id}>
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>
                            {variant.size_id ? "Size info" : "N/A"}
                          </TableCell>
                          <TableCell>
                            {variant.color_id ? "Color info" : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            ${(variant as any).price?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell className="text-right">
                            {variant.stock_level || 0}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(status)}>
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No variants available for this product
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsVariantsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProductList;
