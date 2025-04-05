import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProductModifier } from "@/types/product";

interface ModifierManagerProps {
  onClose?: () => void;
  initialModifiers?: ProductModifier[];
  onModifiersChange?: (modifiers: ProductModifier[]) => void;
}

const ModifierManager = ({
  onClose = () => {},
  initialModifiers,
  onModifiersChange,
}: ModifierManagerProps) => {
  const [modifiers, setModifiers] = useState<ProductModifier[]>(
    initialModifiers || [],
  );
  const [isLoadingModifiers, setIsLoadingModifiers] = useState(false);

  // Fetch modifiers from the database if none provided
  useEffect(() => {
    if (!initialModifiers || initialModifiers.length === 0) {
      const fetchModifiers = async () => {
        setIsLoadingModifiers(true);
        try {
          const { data, error } = await import(
            "@/services/productService"
          ).then((module) => module.getProductModifiers());

          if (error) {
            console.error("Error fetching modifiers:", error);
          } else if (data) {
            setModifiers(data);
          }
        } catch (err) {
          console.error("Error fetching modifiers:", err);
        } finally {
          setIsLoadingModifiers(false);
        }
      };

      fetchModifiers();
    }
  }, [initialModifiers]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModifier, setSelectedModifier] =
    useState<ProductModifier | null>(null);
  const [newModifierName, setNewModifierName] = useState("");
  const [newModifierType, setNewModifierType] = useState<"size" | "color">(
    "size",
  );
  const [filterType, setFilterType] = useState<"all" | "size" | "color">("all");

  // Filter modifiers based on type
  const filteredModifiers = modifiers.filter(
    (modifier) => filterType === "all" || modifier.type === filterType,
  );

  // Notify parent component when modifiers change
  useEffect(() => {
    if (onModifiersChange) {
      onModifiersChange(modifiers);
    }
  }, [modifiers, onModifiersChange]);

  // Add a new modifier
  const handleAddModifier = async () => {
    if (!newModifierName.trim()) return;

    try {
      const newModifier = {
        name: newModifierName.trim(),
        type: newModifierType,
      };

      const { data, error } = await import("@/services/productService").then(
        (module) => module.createProductModifier(newModifier),
      );

      if (error) {
        console.error("Error creating modifier:", error);
        return;
      }

      if (data) {
        setModifiers([...modifiers, data]);
        setNewModifierName("");
        setIsAddDialogOpen(false);
      }
    } catch (err) {
      console.error("Error creating modifier:", err);
    }
  };

  // Edit an existing modifier
  const handleEditModifier = async () => {
    if (!selectedModifier || !newModifierName.trim()) return;

    try {
      const updatedModifier = {
        name: newModifierName.trim(),
        type: newModifierType,
      };

      const { data, error } = await import("@/services/productService").then(
        (module) =>
          module.updateProductModifier(selectedModifier.id, updatedModifier),
      );

      if (error) {
        console.error("Error updating modifier:", error);
        return;
      }

      if (data) {
        const updatedModifiers = modifiers.map((modifier) =>
          modifier.id === selectedModifier.id ? data : modifier,
        );

        setModifiers(updatedModifiers);
        setSelectedModifier(null);
        setNewModifierName("");
        setIsEditDialogOpen(false);
      }
    } catch (err) {
      console.error("Error updating modifier:", err);
    }
  };

  // Delete a modifier
  const handleDeleteModifier = async () => {
    if (!selectedModifier) return;

    try {
      const { data, error } = await import("@/services/productService").then(
        (module) => module.deleteProductModifier(selectedModifier.id),
      );

      if (error) {
        console.error("Error deleting modifier:", error);
        return;
      }

      const updatedModifiers = modifiers.filter(
        (modifier) => modifier.id !== selectedModifier.id,
      );

      setModifiers(updatedModifiers);
      setSelectedModifier(null);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error deleting modifier:", err);
    }
  };

  // Open edit dialog and set selected modifier
  const openEditDialog = (modifier: ProductModifier) => {
    setSelectedModifier(modifier);
    setNewModifierName(modifier.name);
    setNewModifierType(modifier.type);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog and set selected modifier
  const openDeleteDialog = (modifier: ProductModifier) => {
    setSelectedModifier(modifier);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Product Modifiers</CardTitle>
            <CardDescription>
              Manage size and color options for your products
            </CardDescription>
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="size">Sizes</SelectItem>
                <SelectItem value="color">Colors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Modifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Modifier</DialogTitle>
                <DialogDescription>
                  Create a new size or color option for your products
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="modifier-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="modifier-name"
                    value={newModifierName}
                    onChange={(e) => setNewModifierName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Small, Red, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="modifier-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newModifierType}
                    onValueChange={(value) =>
                      setNewModifierType(value as "size" | "color")
                    }
                  >
                    <SelectTrigger className="col-span-3" id="modifier-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddModifier}
                  disabled={!newModifierName.trim()}
                >
                  Add Modifier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingModifiers ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-gray-500"
                  >
                    Loading modifiers...
                  </TableCell>
                </TableRow>
              ) : filteredModifiers.length > 0 ? (
                filteredModifiers.map((modifier) => (
                  <TableRow key={modifier.id}>
                    <TableCell className="font-medium">
                      {modifier.name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {modifier.type}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(modifier)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(modifier)}
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
                    colSpan={3}
                    className="text-center py-6 text-gray-500"
                  >
                    No modifiers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Modifier</DialogTitle>
              <DialogDescription>
                Update the details of this modifier
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-modifier-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-modifier-name"
                  value={newModifierName}
                  onChange={(e) => setNewModifierName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-modifier-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newModifierType}
                  onValueChange={(value) =>
                    setNewModifierType(value as "size" | "color")
                  }
                >
                  <SelectTrigger className="col-span-3" id="edit-modifier-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditModifier}
                disabled={!newModifierName.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete the modifier "
                {selectedModifier?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. Products using this modifier may
                be affected.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteModifier}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ModifierManager;
