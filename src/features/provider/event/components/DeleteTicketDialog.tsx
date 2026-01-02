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
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Ticket } from "../types/eventTypes";
import { useDeleteProviderTicket } from "../hooks/useProviderEvent";

interface DeleteTicketDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteTicketDialog = ({
  ticket,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTicketDialogProps) => {
  const deleteTicketMutation = useDeleteProviderTicket();

  const handleDelete = () => {
    if (ticket?.id) {
      deleteTicketMutation.mutate(ticket.id, {
        onSuccess: () => {
          toastNotification.success("Success!", "Ticket deleted successfully!");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          console.error("Error deleting ticket:", error);
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
              : "Failed to delete ticket";

          toastNotification.error("Error!", errorMessage);
        },
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <AlertDialogDescription>
            Are you sure you want to delete "{ticket?.name}"? This action cannot
            be undone and will permanently remove the ticket from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTicketMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTicketMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteTicketMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Ticket"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTicketDialog;
