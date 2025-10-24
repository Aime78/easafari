import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Event } from "../types/eventTypes";
import { useDeleteProviderEvent } from "../hooks/useProviderEvent";

interface DeleteProviderEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteProviderEventDialog = ({
  event,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProviderEventDialogProps) => {
  const deleteEventMutation = useDeleteProviderEvent();

  const handleDelete = () => {
    if (event?.id) {
      deleteEventMutation.mutate(event.id.toString(), {
        onSuccess: () => {
          toastNotification.success("Success!", "Event deleted successfully!");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          console.error("Error deleting event:", error);
          const errorMessage =
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object" &&
            "message" in error.response.data &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : "Failed to delete event";

          toastNotification.error("Error!", errorMessage);
        },
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{event?.name}"? This action cannot
            be undone and will permanently remove the event from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteEventMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteEventMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteEventMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Event"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProviderEventDialog;
