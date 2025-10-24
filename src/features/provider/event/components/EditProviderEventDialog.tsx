import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { providerEventService } from "../services/eventService";
import {
  createProviderEventSchema,
  type CreateProviderEventFormData,
} from "../schemas/providerEventSchemas";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Event } from "../types/eventTypes";
import { getImageUrl } from "@/lib/imageUtils";

interface EditProviderEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditProviderEventDialog = ({
  event,
  open,
  onOpenChange,
  onSuccess,
}: EditProviderEventDialogProps) => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<CreateProviderEventFormData>({
    resolver: zodResolver(createProviderEventSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      organizer: "",
    },
  });

  // Populate form with event data when dialog opens
  useEffect(() => {
    if (event && open) {
      form.reset({
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location,
        organizer: event.organizer || "",
      });

      // Set existing thumbnail preview and reset image error
      if (event.thumbnail) {
        setThumbnailPreview(getImageUrl(event.thumbnail));
        setImageError(false);
      } else {
        setThumbnailPreview(null);
        setImageError(false);
      }
    }
  }, [event, open, form]);

  const updateEventMutation = useMutation({
    mutationFn: async (
      data: CreateProviderEventFormData & { thumbnail?: File }
    ) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("location", data.location);
      formData.append("organizer", data.organizer);

      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

      return providerEventService.update(event.id.toString(), formData);
    },
    onSuccess: () => {
      toastNotification.success("Success!", "Event updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["provider", "events"],
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to update event"
      );
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setImageError(false); // Reset image error when selecting new file
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: CreateProviderEventFormData) => {
    updateEventMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setImageError(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Event</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="start_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="end_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="organizer"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organizer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Thumbnail Image</FormLabel>
              <div className="flex items-center space-x-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("edit-event-thumbnail-upload")
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
                  </span>
                </Button>
                <input
                  id="edit-event-thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
              {thumbnailPreview && (
                <Card className="w-full">
                  <CardContent className="p-2">
                    {!imageError ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        onError={() => {
                          console.log(
                            "Thumbnail preview failed to load, showing fallback"
                          );
                          setImageError(true);
                        }}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">
                            Preview not available
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setImageError(false)}
                            className="text-xs"
                          >
                            Retry
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateEventMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateEventMutation.isPending}>
                {updateEventMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Event
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProviderEventDialog;
