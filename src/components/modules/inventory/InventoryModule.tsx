import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, History, Package } from "lucide-react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import StockHistory from "./StockHistory";
import ProductFormAlert from "./ProductFormAlert";

import { Product as ProductType, ProductWithVariants } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stockLevel: number;
  reorderPoint: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  variants?: number;
}

interface InventoryModuleProps {
  products?: Product[];
}

const InventoryModule = ({ products = [] }: InventoryModuleProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  // Mock products data if none provided
  const defaultProducts: Product[] = [
    {
      id: "1",
      name: "Office Chair",
      sku: "FURN-001",
      category: "Furniture",
      price: 199.99,
      cost: 120.0,
      stockLevel: 24,
      reorderPoint: 10,
      status: "In Stock",
    },
    {
      id: "2",
      name: "Desk Lamp",
      sku: "LIGHT-002",
      category: "Lighting",
      price: 45.99,
      cost: 22.5,
      stockLevel: 8,
      reorderPoint: 10,
      status: "Low Stock",
    },
    {
      id: "3",
      name: "Wireless Mouse",
      sku: "TECH-003",
      category: "Electronics",
      price: 29.99,
      cost: 15.0,
      stockLevel: 0,
      reorderPoint: 5,
      status: "Out of Stock",
    },
  ];

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
    setActiveTab("add-edit");
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
    setActiveTab("add-edit");
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would call an API to delete the product
    console.log(`Delete product with ID: ${productId}`);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      // Map form data to the format expected by the API
      const productToSave = {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        cost: productData.cost,
        is_active: productData.isActive,
        image_url: productData.imageUrl,
        has_size_modifier: productData.hasSizeModifier,
        has_color_modifier: productData.hasColorModifier,
      };

      // Validate that variants have valid size_id and color_id values
      const validVariants = productData.variants.filter((v: any) => {
        if (!v.sizeId) {
          console.error("Variant missing size_id:", v);
          return false;
        }
        if (productData.hasColorModifier && !v.colorId) {
          console.error(
            "Variant missing color_id for product with color modifiers:",
            v,
          );
          return false;
        }
        return true;
      });

      if (validVariants.length === 0) {
        setAlert({
          type: "error",
          title: "Validation Error",
          message:
            "No valid variants found. Please ensure all variants have valid size and color selections.",
        });
        return;
      }

      // Map variants to the format expected by the API
      const variantsToSave = validVariants.map((v: any) => ({
        sku: v.sku,
        size_id: v.sizeId,
        color_id: v.colorId || null, // Ensure null is passed if no color_id
        stock_level: v.stockLevel,
        reorder_point: v.reorderPoint,
      }));

      // Map prices to the format expected by the API
      const pricesToSave = validVariants.map((v: any, index: number) => ({
        variantIndex: index,
        price: v.price,
      }));

      // If editing an existing product
      if (productData.id) {
        const { data, error } = await import("@/services/productService").then(
          (module) =>
            module.updateProduct(
              productData.id,
              productToSave,
              productData.variants.map((v: any) => ({
                id: v.id,
                sku: v.sku,
                size_id: v.sizeId,
                color_id: v.colorId,
                stock_level: v.stockLevel,
                reorder_point: v.reorderPoint,
              })),
              productData.variants.map((v: any) => ({
                variant_id: v.id,
                price: v.price,
              })),
            ),
        );

        if (error) {
          console.error("Error updating product:", error);
          setAlert({
            type: "error",
            title: "Update Failed",
            message: `Failed to update product: ${error.message}`,
          });
          return;
        }

        setAlert({
          type: "success",
          title: "Product Updated",
          message: "The product has been successfully updated.",
        });
        console.log("Product updated successfully:", data);
      } else {
        // Creating a new product
        const { data, error } = await import("@/services/productService").then(
          (module) =>
            module.createProduct(productToSave, variantsToSave, pricesToSave),
        );

        if (error) {
          console.error("Error creating product:", error);
          setAlert({
            type: "error",
            title: "Creation Failed",
            message: `Failed to create product: ${error.message}`,
          });
          return;
        }

        setAlert({
          type: "success",
          title: "Product Created",
          message: "The new product has been successfully created.",
        });
        console.log("Product created successfully:", data);
      }

      setShowProductForm(false);
      setActiveTab("products");
    } catch (err) {
      console.error("Error saving product:", err);
      setAlert({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while saving the product",
      });
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setActiveTab("products");
  };

  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      {alert && (
        <ProductFormAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Stock History
          </TabsTrigger>
          <TabsTrigger
            value="add-edit"
            className="flex items-center gap-2"
            disabled={!showProductForm}
          >
            {selectedProduct ? "Edit Product" : "Add Product"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <ProductList
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdd={handleAddProduct}
            onSelectProduct={setSelectedProduct}
          />

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Inventory Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-500 font-medium">
                    Total Products
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {displayProducts.length}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-yellow-500 font-medium">
                    Low Stock Items
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {
                      displayProducts.filter((p) => p.status === "Low Stock")
                        .length
                    }
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-red-500 font-medium">Out of Stock</div>
                  <div className="text-2xl font-bold mt-2">
                    {
                      displayProducts.filter((p) => p.status === "Out of Stock")
                        .length
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <StockHistory />
        </TabsContent>

        <TabsContent value="add-edit">
          {showProductForm && (
            <ProductForm
              product={
                selectedProduct
                  ? {
                      id: selectedProduct.id,
                      name: selectedProduct.name,
                      description: "", // Assuming this would come from a more detailed product object
                      category: selectedProduct.category,
                      cost: selectedProduct.cost,
                      isActive: true,
                      hasSizeModifier: true,
                      hasColorModifier: false,
                    }
                  : undefined
              }
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryModule;
