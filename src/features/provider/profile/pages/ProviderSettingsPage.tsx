import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { providerProfileSchema } from "../schemas/providerSchemas";
import type { ProviderProfileFormData } from "../schemas/providerSchemas";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useProviderProfile,
  useSaveProviderProfile,
  useProviderServices,
} from "../hooks/useProvider";
import { toastNotification } from "@/components/custom/ToastNotification";
import { useAuthContext } from "@/contexts/useAuthContext";

const ProviderSettingsPage = () => {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { user } = useAuthContext();

  const { data: profileData, isLoading: isLoadingProfile } =
    useProviderProfile();
  const saveProfileMutation = useSaveProviderProfile();
  const { data: services = [], isLoading: isLoadingServices } =
    useProviderServices();

  // Determine if this is an update (profile exists) or create (new profile)
  const isUpdate = Boolean(profileData?.id);

  const form = useForm<ProviderProfileFormData>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      mobile: "",
      services: [],
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        description: profileData.description || "",
        address: profileData.address || "",
        phone: profileData.phone || "",
        mobile: profileData.mobile || "",
        services: Array.isArray(profileData.services)
          ? profileData.services.map((s) => s.id)
          : [],
      });

      if (profileData.thumbnail) {
        setThumbnailPreview(
          `${import.meta.env.VITE_API_IMAGE_BASE_URL}/${profileData.thumbnail}`
        );
        setImageError(false); // Reset error when loading existing image
      }
    }
  }, [profileData, form]);

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

  const onSubmit = async (data: ProviderProfileFormData) => {
    try {
      if (isUpdate) {
        // For updates, send JSON data
        const updateData = {
          user_id: user?.id?.toString() || "",
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          mobile: data.mobile,
          services: JSON.stringify(data.services),
        };

        await saveProfileMutation.mutateAsync({
          data: updateData,
          isUpdate,
          profileId: profileData?.id,
        });
      } else {
        // For creates, use FormData to handle file uploads
        const formData = new FormData();
        formData.append("user_id", user?.id?.toString() || "");
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        formData.append("mobile", data.mobile);
        formData.append("services", JSON.stringify(data.services));

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        await saveProfileMutation.mutateAsync({
          data: formData,
          isUpdate,
          profileId: profileData?.id,
        });
      }

      toastNotification.success(
        isUpdate ? "Profile Updated" : "Profile Created",
        isUpdate
          ? "Your provider profile has been successfully updated."
          : "Your provider profile has been successfully created."
      );
    } catch (error) {
      console.error("Save failed:", error);
      toastNotification.error(
        isUpdate ? "Update Failed" : "Create Failed",
        isUpdate
          ? "Failed to update your provider profile. Please try again."
          : "Failed to create your provider profile. Please try again."
      );
    }
  };

  return (
    <div className="container py-6">
      <Card className="max-w-2xl border-none">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your provider profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
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
                          placeholder="Enter company description"
                          {...field}
                        />
                      </FormControl>
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

                <div className="space-y-2">
                  <FormLabel>Thumbnail</FormLabel>
                  <div className="flex items-center space-x-4 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document
                          .getElementById("provider-thumbnail-upload")
                          ?.click()
                      }
                      className="flex items-center space-x-2 w-full"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Thumbnail</span>
                    </Button>
                    <input
                      id="provider-thumbnail-upload"
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

                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="mobile"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Services</FormLabel>
                  {isLoadingServices ? (
                    <div className="text-sm text-muted-foreground">
                      Loading services...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex flex-row items-center space-x-2 space-y-0"
                        >
                          <Checkbox
                            checked={
                              form.watch("services")?.includes(service.id) ||
                              false
                            }
                            onCheckedChange={(checked) => {
                              const currentServices =
                                form.getValues("services");
                              if (checked) {
                                // Add service ID if not already present
                                if (!currentServices.includes(service.id)) {
                                  form.setValue("services", [
                                    ...currentServices,
                                    service.id,
                                  ]);
                                }
                              } else {
                                form.setValue(
                                  "services",
                                  currentServices.filter(
                                    (id) => id !== service.id
                                  )
                                );
                              }
                            }}
                          />
                          <FormLabel className="text-sm font-normal">
                            {service.name}
                          </FormLabel>
                        </div>
                      ))}
                    </div>
                  )}
                  {form.formState.errors.services && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.services.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || saveProfileMutation.isPending
                  }
                  className="w-full"
                >
                  {form.formState.isSubmitting || saveProfileMutation.isPending
                    ? isUpdate
                      ? "Updating..."
                      : "Creating..."
                    : isUpdate
                    ? "Update Profile"
                    : "Create Profile"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSettingsPage;
