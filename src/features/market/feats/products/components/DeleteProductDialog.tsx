import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { Trash } from "lucide-react";

import type { Product } from "../../../types/marketTypes";

import { useState } from "react";
import { useDeleteProductMutation } from "../hooks/useProducts";

const DeleteProductDialog = ({ product }: { product: Product }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const { mutateAsync: deleteProduct } = useDeleteProductMutation();

  const handleDelete = async () => {
    await deleteProduct(Number(product.id), {
      onSuccess: () => {
        //todo show toast
        setOpenDelete(false);

        console.log("product deleted");
      },
      onError: (error) => {
        //todo show toast

        console.log("Error deleting product:", error);
      },
    });
  };
  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete "
            {product.name}" store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleDelete} variant="destructive">
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
