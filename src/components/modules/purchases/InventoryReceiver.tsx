import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  Truck,
  Package,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  Check,
} from "lucide-react";

interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
  status: "pending" | "partial" | "complete";
}

interface PurchaseOrder {
  id: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  status: "pending" | "partial" | "complete";
  items: PurchaseOrderItem[];
}

const InventoryReceiver = ({ purchaseOrderId = "PO-2023-0042" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [receivedItems, setReceivedItems] = useState<Record<string, number>>(
    {},
  );

  // Mock data for demonstration
  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-2023-0042",
      supplierName: "Tech Supplies Inc.",
      orderDate: "2023-05-15",
      expectedDelivery: "2023-05-22",
      status: "pending",
      items: [
        {
          id: "item1",
          productId: "prod-001",
          productName: "Wireless Mouse",
          sku: "WM-001",
          orderedQuantity: 25,
          receivedQuantity: 0,
          unitPrice: 15.99,
          status: "pending",
        },
        {
          id: "item2",
          productId: "prod-002",
          productName: "USB-C Cable",
          sku: "USB-C-001",
          orderedQuantity: 50,
          receivedQuantity: 0,
          unitPrice: 8.99,
          status: "pending",
        },
        {
          id: "item3",
          productId: "prod-003",
          productName: "Wireless Keyboard",
          sku: "WK-001",
          orderedQuantity: 20,
          receivedQuantity: 0,
          unitPrice: 29.99,
          status: "pending",
        },
      ],
    },
    {
      id: "PO-2023-0038",
      supplierName: "Office Essentials",
      orderDate: "2023-05-10",
      expectedDelivery: "2023-05-18",
      status: "partial",
      items: [
        {
          id: "item4",
          productId: "prod-004",
          productName: "Desk Organizer",
          sku: "DO-001",
          orderedQuantity: 15,
          receivedQuantity: 10,
          unitPrice: 12.5,
          status: "partial",
        },
        {
          id: "item5",
          productId: "prod-005",
          productName: "Notebook Set",
          sku: "NS-001",
          orderedQuantity: 30,
          receivedQuantity: 30,
          unitPrice: 7.99,
          status: "complete",
        },
      ],
    },
  ];

  // Find purchase order by ID
  React.useEffect(() => {
    const order = mockPurchaseOrders.find((po) => po.id === purchaseOrderId);
    if (order) {
      setSelectedPurchaseOrder(order);
      // Initialize received quantities
      const initialReceivedItems: Record<string, number> = {};
      order.items.forEach((item) => {
        initialReceivedItems[item.id] = 0;
      });
      setReceivedItems(initialReceivedItems);
    }
  }, [purchaseOrderId]);

  const handleQuantityChange = (itemId: string, value: number) => {
    setReceivedItems((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleReceiveInventory = () => {
    setShowConfirmDialog(true);
  };

  const confirmReceiveInventory = () => {
    // Here you would update the inventory in a real application
    console.log("Received items:", receivedItems);
    setShowConfirmDialog(false);

    // Show success message or redirect
    alert("Inventory successfully received and stock levels updated!");
  };

  const getStatusBadge = (status: "pending" | "partial" | "complete") => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "partial":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Partially Received
          </Badge>
        );
      case "complete":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Complete
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!selectedPurchaseOrder) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 p-6">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Inventory Receiver</CardTitle>
            <CardDescription>No purchase order selected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
              <h3 className="text-lg font-medium">
                No Purchase Order Selected
              </h3>
              <p className="text-sm text-gray-500">
                Please select a purchase order to receive inventory against.
              </p>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Browse Purchase Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Receive Inventory</CardTitle>
              <CardDescription>
                Process incoming inventory against purchase order{" "}
                {selectedPurchaseOrder.id}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(selectedPurchaseOrder.status)}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-2">
                Purchase Order Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Supplier:</div>
                  <div className="font-medium">
                    {selectedPurchaseOrder.supplierName}
                  </div>
                  <div className="text-gray-500">Order Date:</div>
                  <div>{selectedPurchaseOrder.orderDate}</div>
                  <div className="text-gray-500">Expected Delivery:</div>
                  <div>{selectedPurchaseOrder.expectedDelivery}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">
                Receiving Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiveDate">Receive Date</Label>
                    <Input
                      id="receiveDate"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input id="receiptNumber" placeholder="Enter receipt #" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Add any notes about this delivery"
                  />
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="partial">Partially Received</TabsTrigger>
              <TabsTrigger value="complete">Complete</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">
                      Previously Received
                    </TableHead>
                    <TableHead className="text-right">Receiving Now</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">
                        {item.orderedQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.receivedQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                Math.max(0, (receivedItems[item.id] || 0) - 1),
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            className="w-20 text-right"
                            value={receivedItems[item.id] || 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min={0}
                            max={item.orderedQuantity - item.receivedQuantity}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                Math.min(
                                  (receivedItems[item.id] || 0) + 1,
                                  item.orderedQuantity - item.receivedQuantity,
                                ),
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {["pending", "partial", "complete"].map((status) => (
              <TabsContent key={status} value={status} className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Ordered</TableHead>
                      <TableHead className="text-right">
                        Previously Received
                      </TableHead>
                      <TableHead className="text-right">
                        Receiving Now
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPurchaseOrder.items
                      .filter((item) => item.status === status)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell className="text-right">
                            {item.orderedQuantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.receivedQuantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    Math.max(
                                      0,
                                      (receivedItems[item.id] || 0) - 1,
                                    ),
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                className="w-20 text-right"
                                value={receivedItems[item.id] || 0}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.id,
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                min={0}
                                max={
                                  item.orderedQuantity - item.receivedQuantity
                                }
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    Math.min(
                                      (receivedItems[item.id] || 0) + 1,
                                      item.orderedQuantity -
                                        item.receivedQuantity,
                                    ),
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleReceiveInventory}>
            <Package className="mr-2 h-4 w-4" />
            Receive Inventory
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Inventory Receipt</DialogTitle>
            <DialogDescription>
              You are about to update inventory levels for the received items.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Verification Required</AlertTitle>
              <AlertDescription>
                Please verify that all received quantities are correct before
                proceeding.
              </AlertDescription>
            </Alert>

            <div className="mt-4 max-h-60 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Receiving</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchaseOrder.items
                    .filter((item) => (receivedItems[item.id] || 0) > 0)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">
                          {receivedItems[item.id] || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {selectedPurchaseOrder.items.every(
                (item) => (receivedItems[item.id] || 0) === 0,
              ) && (
                <p className="text-center py-4 text-gray-500">
                  No items selected for receiving
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReceiveInventory}
              disabled={selectedPurchaseOrder.items.every(
                (item) => (receivedItems[item.id] || 0) === 0,
              )}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirm Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryReceiver;
