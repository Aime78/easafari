import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { providerAccommodationService } from "../services/accommodationService";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Room } from "../types/accommodationTypes";

interface DeleteProviderRoomDialogProps {
  children: React.ReactNode;
  room: Room;
  onSuccess?: () => void;
}

export const DeleteProviderRoomDialog = ({
  children,
  room,
  onSuccess,
}: DeleteProviderRoomDialogProps) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteRoomMutation = useMutation({
    mutationFn: () =>
      providerAccommodationService.deleteRoom(room.id.toString()),
    onSuccess: () => {
      toastNotification.success("Success!", "Room deleted successfully!");
      // Invalidate specific accommodation details
      queryClient.invalidateQueries({
        queryKey: [
          "provider",
          "accommodation",
          room.accommodation_id.toString(),
        ],
      });
      // Invalidate general room and accommodation lists
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodation-rooms"],
      });
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodations"],
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to delete room"
      );
    },
  });

  const handleDelete = () => {
    deleteRoomMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <div className="flex items-center space-x-2">
            <div>
              <AlertDialogTitle>Delete Room</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Are you sure you want to delete "{room.name}"?
              </AlertDialogDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All
                  room data, images, and associated bookings will be permanently
                  removed.
                </p>
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRoomMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteRoomMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteRoomMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProviderRoomDialog;
