import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useSupabaseMutation } from "@/hooks/useSupabaseMutation";
import {
  getSuppliers,
  createSupplier,
  Supplier,
  PurchaseOrder,
} from "@/services/supplierService";
import { useToast } from "@/components/ui/use-toast";

const SupplierManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  // Form state for new supplier
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    status: "active" as const,
  });

  // Fetch suppliers from Supabase
  const {
    data: suppliers,
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery(getSuppliers);

  // Create supplier mutation
  const { mutate: createSupplierMutation, isLoading: isCreating } =
    useSupabaseMutation(createSupplier, {
      onSuccess: () => {
        toast({
          title: "Supplier created",
          description: "The supplier has been successfully added.",
        });
        setIsAddSupplierOpen(false);
        setNewSupplier({
          name: "",
          contact_person: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
          status: "active" as const,
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to create supplier: ${error.message}`,
          variant: "destructive",
        });
      },
    });

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers
    ? suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact_person
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  // Handle supplier selection
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupplierMutation(newSupplier);
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm h-full">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Suppliers</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <Button onClick={() => setIsAddSupplierOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supplier List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>
              Manage your suppliers and their information
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Loading suppliers...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedSupplier?.id === supplier.id ? "bg-primary/10" : "hover:bg-muted"}`}
                      onClick={() => handleSelectSupplier(supplier)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{supplier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {supplier.contact_person || "No contact person"}
                          </p>
                        </div>
                        <div>
                          <Badge
                            className={
                              supplier.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }
                          >
                            {supplier.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No suppliers found
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supplier Details */}
        <Card className="md:col-span-2">
          {selectedSupplier ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedSupplier.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={
                            selectedSupplier.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }
                        >
                          {selectedSupplier.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-muted-foreground">
                                {selectedSupplier.email || "No email provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-muted-foreground">
                                {selectedSupplier.phone || "No phone provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">Address</p>
                              <p className="text-muted-foreground">
                                {selectedSupplier.address ||
                                  "No address provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Additional Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Contact Person</p>
                            <p className="text-muted-foreground">
                              {selectedSupplier.contact_person ||
                                "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Notes</p>
                            <p className="text-muted-foreground">
                              {selectedSupplier.notes || "No notes"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="orders">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-6 text-muted-foreground"
                            >
                              No purchase orders found for this supplier
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button>
                        <FileText className="h-4 w-4 mr-2" /> Create Purchase
                        Order
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-6">
              <DollarSign className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Supplier Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a supplier from the list to view their details, contact
                information, and purchase history.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter the supplier's details below to add them to your system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_person" className="text-right">
                  Contact Person
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={newSupplier.contact_person}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={newSupplier.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newSupplier.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddSupplierOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Supplier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManager;
