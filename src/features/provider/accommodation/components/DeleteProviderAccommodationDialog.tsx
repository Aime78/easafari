import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { providerAccommodationService } from "../services/accommodationService";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Accommodation } from "../types/accommodationTypes";

interface DeleteProviderAccommodationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accommodation: Accommodation;
  onSuccess?: () => void;
}

export const DeleteProviderAccommodationDialog = ({
  open,
  onOpenChange,
  accommodation,
  onSuccess,
}: DeleteProviderAccommodationDialogProps) => {
  const queryClient = useQueryClient();

  const deleteAccommodationMutation = useMutation({
    mutationFn: async (id: string) => {
      return providerAccommodationService.delete(id);
    },
    onSuccess: () => {
      toastNotification.success(
        "Success!",
        "Accommodation deleted successfully!"
      );
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodations"],
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to delete accommodation"
      );
    },
  });

  const handleDelete = () => {
    deleteAccommodationMutation.mutate(accommodation.id.toString());
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Delete Accommodation</AlertDialogTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete "{accommodation.name}"? This action
            cannot be undone and will permanently remove the accommodation from
            your listings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteAccommodationMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAccommodationMutation.isPending}
          >
            {deleteAccommodationMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Accommodation
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProviderAccommodationDialog;
