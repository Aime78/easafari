import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, ImageIcon, RotateCcw, X } from "lucide-react";
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
import { providerExperienceService } from "../services/experienceService";
import { createProviderExperienceSchema } from "../schemas/providerExperienceSchemas";
import {
  useProviderExperienceCategories,
  useProviderAttractions,
} from "../hooks/useProviderExperience";
import { toastNotification } from "@/components/custom/ToastNotification";
import type { Experience } from "../types/experienceTypes";
import { getImageUrl } from "@/lib/imageUtils";

type EditProviderExperienceForm = z.infer<
  typeof createProviderExperienceSchema
>;

interface EditProviderExperienceDialogProps {
  children?: React.ReactNode;
  experience: Experience;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditProviderExperienceDialog = ({
  children,
  experience,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
}: EditProviderExperienceDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const queryClient = useQueryClient();
  const { categories, loading: categoriesLoading } =
    useProviderExperienceCategories();
  const { data: attractions = [], isLoading: attractionsLoading } =
    useProviderAttractions();

  const form = useForm<EditProviderExperienceForm>({
    resolver: zodResolver(createProviderExperienceSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      price: "",
      duration: "",
      whats_included: "",
      experience_category_id: "",
      attraction_id: "",
    },
  });

  // Populate form with experience data when dialog opens
  useEffect(() => {
    if (open && experience) {
      form.reset({
        name: experience.name,
        description: experience.description,
        address: experience.address,
        price: experience.price.toString(),
        duration: experience.duration,
        whats_included: experience.whats_included,
        experience_category_id: experience.experience_category_id.toString(),
        attraction_id: experience.attraction_id?.toString() || "",
      });

      // Set existing thumbnail preview
      if (experience.thumbnail) {
        setThumbnailPreview(getImageUrl(experience.thumbnail));
        setImageError(false); // Reset error when loading existing image
      } else {
        setThumbnailPreview(null);
      }
      setThumbnailFile(null);
    }
  }, [open, experience, form]);

  const updateExperienceMutation = useMutation({
    mutationFn: async (
      data: EditProviderExperienceForm & { thumbnail?: File }
    ) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("price", data.price);
      formData.append("duration", data.duration);
      formData.append("whats_included", data.whats_included);
      formData.append("experience_category_id", data.experience_category_id);
      formData.append("attractions", JSON.stringify([data.attraction_id]));
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      return providerExperienceService.update(
        experience.id.toString(),
        formData
      );
    },
    onSuccess: () => {
      toastNotification.success("Success!", "Experience updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["provider", "experiences"],
      });
      handleOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to update experience"
      );
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setImageError(false); // Reset error when new file is selected
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    console.log("Image failed to load, showing fallback UI");
    setImageError(true);
  };

  const retryImage = () => {
    console.log("Retrying image load");
    setImageError(false);
  };

  const onSubmit = (data: EditProviderExperienceForm) => {
    updateExperienceMutation.mutate({
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
        <AlertDialogHeader className="relative">
          <AlertDialogTitle>Edit Experience</AlertDialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => handleOpenChange(false)}
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
                    <Input placeholder="Enter experience name" {...field} />
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
              name="experience_category_id"
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
                  <FormLabel>Price</FormLabel>
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
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2 hours, Half day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="whats_included"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's Included</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Guide, Transportation, Refreshments..."
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
                        "edit-provider-experience-thumbnail-upload"
                      )
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Change Thumbnail</span>
                </Button>
                <input
                  id="edit-provider-experience-thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
              {thumbnailPreview && (
                <Card className="w-full">
                  <CardContent className="p-2">
                    {imageError ? (
                      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300">
                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Image failed to load
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={retryImage}
                          className="flex items-center space-x-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Retry</span>
                        </Button>
                      </div>
                    ) : (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded"
                        onError={handleImageError}
                      />
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
                disabled={updateExperienceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateExperienceMutation.isPending}
              >
                {updateExperienceMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Experience
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProviderExperienceDialog;
