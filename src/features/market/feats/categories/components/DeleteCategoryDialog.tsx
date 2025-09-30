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

import type { Category, SubCategory } from "../../../types/marketTypes";

import { useState } from "react";
import {
  useDeleteCategoryMutation,
  useDeleteSubCategoryMutation,
} from "../hooks/useCategories";

const DeleteCategoryDialog = ({
  category,
}: {
  category: Category | SubCategory;
}) => {
  const [openDelete, setOpenDelete] = useState(false);

  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation();
  const { mutateAsync: deleteSubCategory } = useDeleteSubCategoryMutation();

  const handleDelete = async () => {
    if ("category_id" in category) {
      await deleteSubCategory(Number(category.id), {
        onSuccess: () => {
          //todo show toast
          setOpenDelete(false);

          console.log("subcat deleted");
        },
        onError: (error) => {
          //todo show toast

          console.log("Error deleting SUBcat:", error);
        },
      });
    } else {
      await deleteCategory(Number(category.id), {
        onSuccess: () => {
          //todo show toast
          setOpenDelete(false);

          console.log("cat deleted");
        },
        onError: (error) => {
          //todo show toast

          console.log("Error deleting cat:", error);
        },
      });
    }
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
            {category.name}" store.
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

export default DeleteCategoryDialog;
