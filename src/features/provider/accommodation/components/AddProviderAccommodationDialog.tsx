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
import { createProviderAccommodationSchema } from "../schemas/providerAccommodationSchemas";
import {
  useProviderAccommodationCategories,
  useProviderAttractions,
} from "../hooks/useProviderAccommodation";
import { toastNotification } from "@/components/custom/ToastNotification";

type AddProviderAccommodationForm = z.infer<
  typeof createProviderAccommodationSchema
>;

interface AddProviderAccommodationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const AddProviderAccommodationDialog = ({
  children,
  onSuccess,
}: AddProviderAccommodationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { categories, loading: categoriesLoading } =
    useProviderAccommodationCategories();
  const { data: attractions = [], isLoading: attractionsLoading } =
    useProviderAttractions();
  const form = useForm<AddProviderAccommodationForm>({
    resolver: zodResolver(createProviderAccommodationSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      price: "",
      latitude: "",
      longitude: "",
      rating: "",
      amenities: "",
      accommodation_category_id: "",
      attraction_id: "",
    },
  });

  const createAccommodationMutation = useMutation({
    mutationFn: async (
      data: AddProviderAccommodationForm & { thumbnail?: File }
    ) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("price", data.price);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("rating", data.rating);
      formData.append("amenities", data.amenities);
      formData.append(
        "accommodation_category_id",
        data.accommodation_category_id
      );
      formData.append("attractions", JSON.stringify([data.attraction_id]));
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      return providerAccommodationService.create(formData);
    },
    onSuccess: () => {
      toastNotification.success(
        "Success!",
        "Accommodation created successfully!"
      );
      queryClient.invalidateQueries({
        queryKey: ["provider", "accommodations"],
      });
      form.reset();
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to create accommodation"
      );
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: AddProviderAccommodationForm) => {
    createAccommodationMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>New Accommodation</AlertDialogTitle>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="latitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-1.2921"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="longitude"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="36.8219"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="rating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-5)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      {...field}
                    />
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
                      .getElementById("provider-accommodation-thumbnail-upload")
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Thumbnail</span>
                </Button>
                <input
                  id="provider-accommodation-thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
              {thumbnailPreview && (
                <Card className="w-full">
                  <CardContent className="p-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createAccommodationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAccommodationMutation.isPending}
              >
                {createAccommodationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Accommodation
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddProviderAccommodationDialog;
