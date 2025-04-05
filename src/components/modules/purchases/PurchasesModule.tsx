import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FileText, Users, Plus } from "lucide-react";

// Import components with default exports
import PurchaseOrderList from "./PurchaseOrderList";
import PurchaseOrderForm from "./PurchaseOrderForm";
import InventoryReceiver from "./InventoryReceiver";
import SupplierManager from "./SupplierManager";

interface PurchasesModuleProps {
  defaultTab?: string;
}

const PurchasesModule = ({ defaultTab = "orders" }: PurchasesModuleProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCreateNewOrder = () => {
    setShowNewOrderForm(true);
    setIsEditingOrder(false);
    setActiveTab("orders");
    setSelectedOrder(null);
  };

  const handleEditOrder = (id: string) => {
    setSelectedOrderId(id);
    setIsEditingOrder(true);
    setShowNewOrderForm(true);
    setActiveTab("orders");
  };

  const handleViewOrder = (id: string) => {
    setSelectedOrderId(id);
    setActiveTab("receive");
  };

  const handleFormCancel = () => {
    setShowNewOrderForm(false);
    setSelectedOrderId(null);
    setIsEditingOrder(false);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setShowNewOrderForm(false);
    setSelectedOrderId(null);
    setIsEditingOrder(false);
  };

  return (
    <div className="w-full h-full bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Purchases Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage purchase orders, receive inventory, and track suppliers
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateNewOrder}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Purchase Order
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <FileText size={16} />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="receive" className="flex items-center gap-2">
            <Package size={16} />
            Receive Inventory
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <Users size={16} />
            Suppliers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {showNewOrderForm ? (
            <PurchaseOrderForm
              isEditing={isEditingOrder}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              order={selectedOrder}
            />
          ) : (
            <PurchaseOrderList
              onCreateNew={handleCreateNewOrder}
              onEdit={handleEditOrder}
              onView={handleViewOrder}
              onDelete={(id) => console.log("Delete order:", id)}
              onSelectOrder={(order) => {
                setSelectedOrder(order);
                if (order) {
                  handleEditOrder(order.id);
                } else {
                  handleCreateNewOrder();
                }
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="receive" className="space-y-4">
          <InventoryReceiver
            purchaseOrderId={selectedOrderId || "PO-2023-0042"}
          />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <SupplierManager />
        </TabsContent>
      </Tabs>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Expected Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 arriving today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 new this month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchasesModule;
