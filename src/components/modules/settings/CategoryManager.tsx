import React, { useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "general",
      name: "General",
      description: "General products",
    },
    {
      id: "electronics",
      name: "Electronics",
      description: "Electronic devices and accessories",
    },
    {
      id: "clothing",
      name: "Clothing",
      description: "Apparel and fashion items",
    },
    {
      id: "food",
      name: "Food & Beverage",
      description: "Food and drink products",
    },
    {
      id: "office",
      name: "Office Supplies",
      description: "Office and stationery items",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
    };

    setCategories([...categories, newCategory]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = () => {
    if (!selectedCategory || !newCategoryName.trim()) return;

    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id
        ? {
            ...category,
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim(),
          }
        : category,
    );

    setCategories(updatedCategories);
    resetForm();
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    // Don't allow deleting the general category
    if (selectedCategory.id === "general") {
      alert("Cannot delete the General category.");
      return;
    }

    const updatedCategories = categories.filter(
      (category) => category.id !== selectedCategory.id,
    );

    setCategories(updatedCategories);
    setSelectedCategory(null);
    setIsDeleteDialogOpen(false);
  };

  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryDescription("");
    setSelectedCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>
          Manage product categories for your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Available Categories</h3>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new product category
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Electronics, Furniture, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="category-description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(category)}
                          disabled={category.id === "general"}
                        >
                          <Trash2
                            className={`h-4 w-4 ${category.id === "general" ? "text-gray-300" : "text-red-500"}`}
                          />
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
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the details of this category
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="edit-category-description"
                  className="text-right"
                >
                  Description
                </Label>
                <Input
                  id="edit-category-description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
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
                Are you sure you want to delete the category "
                {selectedCategory?.name}"?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. Products in this category will
                need to be reassigned.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
