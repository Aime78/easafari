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
import { attractionsApi } from "@/lib/api";
import { addAttractionSchema } from "@/lib/schemaValidation";
import { useAttractionCategories } from "@/hooks/useAttractionCategories";
import { toastNotification } from "@/components/custom/ToastNotification";

type AddAttractionForm = z.infer<typeof addAttractionSchema>;

interface AddAttractionDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const AddAttractionDialog = ({ children, onSuccess }: AddAttractionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const queryClient = useQueryClient();
  const { categories, loading: categoriesLoading } = useAttractionCategories();  const form = useForm<AddAttractionForm>({
    resolver: zodResolver(addAttractionSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      latitude: "",
      longitude: "",
      rating: "",
      attraction_category_id: "",
    },
  });

  const createAttractionMutation = useMutation({
    mutationFn: async (data: AddAttractionForm & { thumbnail?: File; images?: File[] }) => {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('address', data.address);
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('rating', data.rating);
      formData.append('attraction_category_id', data.attraction_category_id);
      
      // Add thumbnail
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }
      
      // Add additional images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      return attractionsApi.create(formData);
    },
    onSuccess: () => {
      toastNotification.success(
        "Success!",
        "Attraction created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
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
        error instanceof Error ? error.message : "Failed to create attraction"
      );
    },
  });

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImages = [...additionalImages, ...files];
      setAdditionalImages(newImages);

      // Create previews
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
    const newImages = additionalImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data: AddAttractionForm) => {
    createAttractionMutation.mutate({
      ...data,
      thumbnail: thumbnailFile || undefined,
      images: additionalImages.length > 0 ? additionalImages : undefined,
    });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New Attraction</AlertDialogTitle>
          </AlertDialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attraction name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter attraction description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="attraction_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attraction address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Latitude and Longitude Fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
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
                  control={form.control}
                  name="longitude"
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

              {/* Rating Field */}
              <FormField
                control={form.control}
                name="rating"
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

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <FormLabel>Thumbnail Image</FormLabel>
                <div className="flex items-center space-x-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    className="flex items-center space-x-2 w-full"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Thumbnail</span>
                  </Button>
                  <input
                    id="thumbnail-upload"
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

              {/* Additional Images Upload */}
              <div className="space-y-2">
                <FormLabel>Additional Images (Optional)</FormLabel>
                <div className="flex items-center space-x-4 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images-upload')?.click()}
                    className="flex items-center space-x-2 w-full"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Images</span>
                  </Button>
                  <input
                    id="images-upload"
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createAttractionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAttractionMutation.isPending}
                >
                  {createAttractionMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Attraction
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
