import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, ImageIcon } from "lucide-react";
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
import { createProviderAccommodationSchema } from "../schemas/providerAccommodationSchemas";
import {
  useProviderAccommodationCategories,
  useProviderAttractions,
} from "../hooks/useProviderAccommodation";
import { toastNotification } from "@/components/custom/ToastNotification";
import { getImageUrl } from "@/lib/imageUtils";
import type { Accommodation } from "../types/accommodationTypes";

type EditProviderAccommodationForm = z.infer<
  typeof createProviderAccommodationSchema
>;

interface EditProviderAccommodationDialogProps {
  children?: React.ReactNode;
  accommodation: Accommodation;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditProviderAccommodationDialog = ({
  children,
  accommodation,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
}: EditProviderAccommodationDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const queryClient = useQueryClient();
  const { categories, loading: categoriesLoading } =
    useProviderAccommodationCategories();
  const { data: attractions = [], isLoading: attractionsLoading } =
    useProviderAttractions();

  const form = useForm<EditProviderAccommodationForm>({
    resolver: zodResolver(createProviderAccommodationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      price: "",
      amenities: "",
      accommodation_category_id: "",
      attraction_id: "",
    },
  });

  // Populate form with accommodation data when dialog opens
  useEffect(() => {
    if (open && accommodation) {
      form.reset({
        name: accommodation.name,
        description: accommodation.description,
        address: accommodation.address,
        price: accommodation.price.toString(),
        amenities: accommodation.amenities,
        accommodation_category_id:
          accommodation.accommodation_category_id.toString(),
        attraction_id: accommodation.attraction_id?.toString() || "",
      });

      // Set existing thumbnail preview and reset image error
      if (accommodation.thumbnail) {
        setThumbnailPreview(getImageUrl(accommodation.thumbnail));
        setImageError(false);
      } else {
        setThumbnailPreview(null);
        setImageError(false);
      }
      setThumbnailFile(null);
    }
  }, [open, accommodation, form]);

  const updateAccommodationMutation = useMutation({
    mutationFn: async (
      data: EditProviderAccommodationForm & { thumbnail?: File }
    ) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("price", data.price);
      formData.append("amenities", data.amenities);
      formData.append(
        "accommodation_category_id",
        data.accommodation_category_id
      );
      formData.append("attractions", JSON.stringify([data.attraction_id]));
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      return providerAccommodationService.update(
        accommodation.id.toString(),
        formData
      );
    },
    onSuccess: () => {
      toastNotification.success(
        "Success!",
        "Accommodation updated successfully!"
      );
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodations"],
      });
      handleOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to update accommodation"
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

  const onSubmit = (data: EditProviderAccommodationForm) => {
    updateAccommodationMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
    if (!newOpen) {
      // Reset form and preview when closing
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setImageError(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Accommodation</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter accommodation name" {...field} />
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
                      placeholder="Enter description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="accommodation_category_id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="attraction_id"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attraction</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an attraction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attractionsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading attractions...
                        </SelectItem>
                      ) : (
                        attractions.map((attraction) => (
                          <SelectItem
                            key={attraction.id}
                            value={attraction.id.toString()}
                          >
                            {attraction.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per night</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="150"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="amenities"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="WiFi, Air Conditioning, Pool, Restaurant..."
                      {...field}
                    />
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
                      .getElementById(
                        "edit-provider-accommodation-thumbnail-upload"
                      )
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Change Thumbnail</span>
                </Button>
                <input
                  id="edit-provider-accommodation-thumbnail-upload"
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
                onClick={() => handleOpenChange(false)}
                disabled={updateAccommodationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAccommodationMutation.isPending}
              >
                {updateAccommodationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Accommodation
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProviderAccommodationDialog;
