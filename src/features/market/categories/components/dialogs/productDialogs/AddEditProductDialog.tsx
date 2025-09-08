import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Edit } from "lucide-react";
import type { Product } from "../../../types/marketTypes";

import { stores, categories, subCategories } from "../../../data/dummyData";

interface AddEditProductDialogProps {
  product?: Product;
}

const AddEditProductDialog = ({ product }: AddEditProductDialogProps) => {
  //todo convert this to shadcn controlled form with zod validation schema
  //todo and use tanstack query for it
  const [openProduct, setOpenProduct] = useState(false);

  const isCreatingProduct = !product;

  return (
    <Dialog open={openProduct} onOpenChange={setOpenProduct}>
      <DialogTrigger asChild>
        {isCreatingProduct ? (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreatingProduct ? "New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder={isCreatingProduct ? "Product Name" : product.name}
        />
        <Textarea
          placeholder={isCreatingProduct ? "Description" : product.description}
        />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((s) => (
              <SelectItem value={s.name}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem value={c.name}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subCategories.map((sc) => (
              <SelectItem value={sc.name}>{sc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Price" type="number" />
        <Input placeholder="Discount (%)" type="number" />
        <Input placeholder="Rating (0-5)" type="number" step="0.1" />
        <Input placeholder="Stock" type="number" />
        <Input type="file" />
        <Button className="mt-4">Save</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProductDialog;
