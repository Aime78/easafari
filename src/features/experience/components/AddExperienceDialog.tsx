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
import { experienceService } from "../services/experienceService";
import { createExperienceSchema } from "../schemas/experienceSchemas";
import { useExperienceCategories } from "../hooks/useExperience";
import { toastNotification } from "@/components/custom/ToastNotification";

type AddExperienceForm = z.infer<typeof createExperienceSchema>;

interface AddExperienceDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const AddExperienceDialog = ({
  children,
  onSuccess,
}: AddExperienceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { categories, loading: categoriesLoading } = useExperienceCategories();
  const form = useForm<AddExperienceForm>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      price: "",
      duration: "",
      latitude: "",
      longitude: "",
      rating: "",
      included: "",
      excluded: "",
      experience_category_id: "",
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: async (
      data: AddExperienceForm & { thumbnail?: File; images?: File[] }
    ) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("price", data.price);
      formData.append("duration", data.duration);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("rating", data.rating);
      formData.append("included", data.included);
      formData.append("excluded", data.excluded);
      formData.append("experience_category_id", data.experience_category_id);
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      if (data.images && data.images.length > 0) {
        data.images.forEach((img, i) => formData.append(`images[${i}]`, img));
      }
      return experienceService.create(formData);
    },
    onSuccess: () => {
      toastNotification.success("Success!", "Experience created successfully!");
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      form.reset();
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setAdditionalImages([]);
      setImagePreviews([]);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toastNotification.error(
        "Error",
        error instanceof Error ? error.message : "Failed to create experience"
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

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const newImages = [...additionalImages, ...files];
      setAdditionalImages(newImages);
      const newPreviews = [...imagePreviews];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          setImagePreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AddExperienceForm) => {
    createExperienceMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
      images: additionalImages.length ? additionalImages : undefined,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>New Experience</AlertDialogTitle>
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
                        placeholder="0.436396"
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
                        placeholder="30.3641312"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
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
                      <Input placeholder="2 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="rating"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
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
            </div>
            <FormField
              name="included"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Included</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Guide, Equipment, Transport"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="excluded"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excluded</FormLabel>
                  <FormControl>
                    <Input placeholder="Meals, Personal expenses" {...field} />
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
                      .getElementById("experience-thumbnail-upload")
                      ?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Thumbnail</span>
                </Button>
                <input
                  id="experience-thumbnail-upload"
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
            <div className="space-y-2">
              <FormLabel>Additional Images (Optional)</FormLabel>
              <div className="flex items-center space-x-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("experience-images-upload")?.click()
                  }
                  className="flex items-center space-x-2 w-full"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Images</span>
                </Button>
                <input
                  id="experience-images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="hidden"
                />
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">
                  {imagePreviews.map((preview, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-2">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
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
                disabled={createExperienceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createExperienceMutation.isPending}
              >
                {createExperienceMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Experience
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
