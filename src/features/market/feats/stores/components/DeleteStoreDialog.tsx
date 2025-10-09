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
import type { Store } from "@/features/market/types/marketTypes";

import { Trash } from "lucide-react";

import { useState } from "react";
import { useDeleteStoreMutation } from "../hooks/useStores";

const DeleteStoreDialog = ({ store }: { store: Store }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const { mutateAsync: deleteStore } = useDeleteStoreMutation();

  const handleDelete = async () => {
    await deleteStore(
      { id: Number(store.id) },
      {
        onSuccess: () => {
          //todo show toast
          setOpenDelete(false);

          console.log("Store deleted");
        },
        onError: (error) => {
          //todo show toast

          console.log("Error deleting store:", error);
        },
      }
    );
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
            {store.name}" store.
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

export default DeleteStoreDialog;
