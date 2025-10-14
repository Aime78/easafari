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
import { useProviderAccommodations } from "../hooks/useProviderAccommodation";
import type { Accommodation } from "../types/accommodationTypes";

// Schema for room creation
const createProviderRoomSchema = z.object({
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
  accommodation_id: z.string().min(1, "Accommodation is required"),
});

type AddProviderRoomForm = z.infer<typeof createProviderRoomSchema>;

interface AddProviderAccommodationRoomDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const AddProviderAccommodationRoomDialog = ({
  children,
  onSuccess,
}: AddProviderAccommodationRoomDialogProps) => {
  const [open, setOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { data: accommodations = [], isLoading: accommodationsLoading } =
    useProviderAccommodations();

  const form = useForm<AddProviderRoomForm>({
    resolver: zodResolver(createProviderRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: "",
      price_per_night: "",
      is_available: "1",
      quantity: "",
      accommodation_id: "",
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: async (data: AddProviderRoomForm & { images?: File[] }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("capacity", data.capacity);
      formData.append("price_per_night", data.price_per_night);
      formData.append("is_available", data.is_available);
      formData.append("quantity", data.quantity);
      formData.append("accommodation_id", data.accommodation_id);

      // Add multiple images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      return providerAccommodationService.createRoom(formData);
    },
    onSuccess: () => {
      toastNotification.success("Success!", "Room created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodation-rooms"],
      });
      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to create room"
      );
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImageFiles = [...imageFiles, ...files];
      setImageFiles(newImageFiles);

      // Create previews for new files
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AddProviderRoomForm) => {
    createRoomMutation.mutate({
      ...data,
      images: imageFiles,
    });
  };

  // Get accommodations array - handle both array and wrapped response
  let accommodationsList: Accommodation[] = [];
  if (accommodations) {
    if (Array.isArray(accommodations)) {
      accommodationsList = accommodations;
    } else {
      const dataObj = accommodations as unknown as { data?: Accommodation[] };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        accommodationsList = dataObj.data;
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Room</AlertDialogTitle>
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

            <FormField
              name="accommodation_id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accommodation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select accommodation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accommodationsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading accommodations...
                        </SelectItem>
                      ) : (
                        accommodationsList.map((accommodation) => (
                          <SelectItem
                            key={accommodation.id}
                            value={accommodation.id.toString()}
                          >
                            {accommodation.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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

            <div className="space-y-2">
              <FormLabel>Room Images</FormLabel>
              <div className="flex items-center space-x-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("provider-room-images-upload")
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Room Images</span>
                </Button>
                <input
                  id="provider-room-images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-2">
                        <img
                          src={preview}
                          alt={`Room preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createRoomMutation.isPending}>
                {createRoomMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Room
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddProviderAccommodationRoomDialog;
