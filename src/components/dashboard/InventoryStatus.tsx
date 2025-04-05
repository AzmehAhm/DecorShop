import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Package } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  category: string;
  sales: number;
}

interface InventoryStatusProps {
  lowStockItems?: InventoryItem[];
  topSellingItems?: InventoryItem[];
}

const InventoryStatus = ({
  lowStockItems = [
    {
      id: "1",
      name: "Wireless Headphones",
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      category: "Electronics",
      sales: 0,
    },
    {
      id: "2",
      name: "Office Chair",
      currentStock: 3,
      minStock: 8,
      maxStock: 30,
      category: "Furniture",
      sales: 0,
    },
    {
      id: "3",
      name: "Printer Paper",
      currentStock: 2,
      minStock: 15,
      maxStock: 100,
      category: "Office Supplies",
      sales: 0,
    },
  ],
  topSellingItems = [
    {
      id: "4",
      name: "Smartphone Case",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      category: "Accessories",
      sales: 128,
    },
    {
      id: "5",
      name: "USB-C Cable",
      currentStock: 78,
      minStock: 30,
      maxStock: 150,
      category: "Electronics",
      sales: 95,
    },
    {
      id: "6",
      name: "Notebook",
      currentStock: 112,
      minStock: 50,
      maxStock: 200,
      category: "Office Supplies",
      sales: 87,
    },
  ],
}: InventoryStatusProps) => {
  // Calculate stock percentage for progress bars
  const calculateStockPercentage = (current: number, max: number) => {
    return Math.min(Math.round((current / max) * 100), 100);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Inventory Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Low Stock Alerts Section */}
        <div>
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.currentStock} in stock</span>
                    <span>Min: {item.minStock}</span>
                  </div>
                  <Progress
                    value={calculateStockPercentage(
                      item.currentStock,
                      item.maxStock,
                    )}
                    className="h-1.5 mt-1"
                    indicatorClassName={
                      item.currentStock < item.minStock
                        ? "bg-red-500"
                        : "bg-amber-500"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products Section */}
        <div>
          <div className="flex items-center mb-3">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium">Top Selling Products</h3>
          </div>
          <div className="space-y-3">
            {topSellingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs font-medium text-green-600">
                      {item.sales} sold
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.currentStock} in stock</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <Progress
                    value={calculateStockPercentage(
                      item.currentStock,
                      item.maxStock,
                    )}
                    className="h-1.5 mt-1"
                    indicatorClassName="bg-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Inventory Actions */}
        <div className="pt-2">
          <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            <Package className="h-4 w-4 mr-2" />
            View Full Inventory
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;
