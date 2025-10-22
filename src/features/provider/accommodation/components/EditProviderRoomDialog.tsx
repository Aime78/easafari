import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { providerAccommodationService } from "../services/accommodationService";
import { toastNotification } from "@/components/custom/ToastNotification";
import { getImageUrl, getFallbackImageUrl } from "@/lib/imageUtils";
import type { Room } from "../types/accommodationTypes";

// Schema for room editing
const editProviderRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(255, "Room name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  capacity: z
    .string()
    .min(1, "Capacity is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      "Capacity must be a positive number"
    ),
  price_per_night: z
    .string()
    .min(1, "Price per night is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Price must be a positive number"
    ),
  is_available: z.string().min(1, "Availability status is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      "Quantity must be a positive number"
    ),
});

type EditProviderRoomForm = z.infer<typeof editProviderRoomSchema>;

interface EditProviderRoomDialogProps {
  children: React.ReactNode;
  room: Room;
  onSuccess?: () => void;
}

export const EditProviderRoomDialog = ({
  children,
  room,
  onSuccess,
}: EditProviderRoomDialogProps) => {
  const [open, setOpen] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    room.images || []
  );

  const queryClient = useQueryClient();

  const form = useForm<EditProviderRoomForm>({
    resolver: zodResolver(editProviderRoomSchema),
    defaultValues: {
      name: room.name,
      description: room.description,
      capacity: room.capacity.toString(),
      price_per_night: room.price_per_night.toString(),
      is_available: room.is_available.toString(),
      quantity: room.quantity.toString(),
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: async (data: EditProviderRoomForm & { newImages?: File[] }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("capacity", data.capacity);
      formData.append("price_per_night", data.price_per_night);
      formData.append("is_available", data.is_available);
      formData.append("quantity", data.quantity);
      formData.append("accommodation_id", room.accommodation_id.toString());

      // Add existing images that weren't removed
      existingImages.forEach((image, index) => {
        formData.append(`existing_images[${index}]`, image);
      });

      // Add new images
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((image, index) => {
          formData.append(`new_images[${index}]`, image);
        });
      }

      return providerAccommodationService.updateRoom(
        room.id.toString(),
        formData
      );
    },
    onSuccess: () => {
      toastNotification.success("Success!", "Room updated successfully!");
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
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to update room"
      );
    },
  });

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...newImageFiles, ...files];
      setNewImageFiles(newFiles);

      // Create previews for new files
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EditProviderRoomForm) => {
    updateRoomMutation.mutate({
      ...data,
      newImages: newImageFiles,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Room: {room.name}</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter room name (e.g., Single Room)"
                      {...field}
                    />
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
                      placeholder="Enter room description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="capacity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="price_per_night"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="quantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="is_available"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Available</SelectItem>
                        <SelectItem value="0">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Room Images</FormLabel>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((image, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={getImageUrl(image)}
                            alt={`Room image ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = getFallbackImageUrl();
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div>
                <div className="flex items-center space-x-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document
                        .getElementById("edit-room-images-upload")
                        ?.click()
                    }
                    className="flex items-center space-x-2 w-full"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Add More Images</span>
                  </Button>
                  <input
                    id="edit-room-images-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageChange}
                    className="hidden"
                  />
                </div>

                {newImagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2 mt-4">
                      New Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {newImagePreviews.map((preview, index) => (
                        <Card key={index} className="relative">
                          <CardContent className="p-2">
                            <img
                              src={preview}
                              alt={`New room preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeNewImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateRoomMutation.isPending}>
                {updateRoomMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Room
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProviderRoomDialog;
