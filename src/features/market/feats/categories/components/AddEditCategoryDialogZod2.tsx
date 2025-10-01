import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Edit } from "lucide-react";

import {
  useCategoryQuery,
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../hooks/useCategories";

import { categorySchema } from "../../../lib/schemas/marketSchemas";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Category, SubCategory } from "../../../types/marketTypes";
import z from "zod";

interface AddEditCategoryDialogZod2Props {
  category?: Category | SubCategory;
}

type CategoryFormData = z.infer<typeof categorySchema>;

const AddEditCategoryDialogZod2 = ({
  category,
}: AddEditCategoryDialogZod2Props) => {
  const isEditing = !!category;

  const isSubCategory = (c: Category | SubCategory): c is SubCategory =>
    "category_id" in c;

  // Determine initial category_id value more carefully
  const getInitialCategoryId = () => {
    if (!category) return "none";

    if (isSubCategory(category)) {
      // For subcategories, use the actual parent category ID
      return category.category_id.toString();
    }

    // For main categories, default to "none"
    return "none";
  };

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      thumbnail: undefined,
      category_id: getInitialCategoryId(),
    },
  });

  const [openCatalog, setOpenCatalog] = useState(false);

  const { myCategories, isLoading } = useCategoryQuery();

  // Create mutations
  const { mutateAsync: createCategory } = useCreateCategoryMutation();
  const { mutateAsync: createSubCategory } = useCreateSubCategoryMutation();

  // Update mutations
  const { mutateAsync: updateCategory } = useUpdateCategoryMutation();
  const { mutateAsync: updateSubCategory } = useUpdateSubCategoryMutation();

  const saveCategory = async (data: CategoryFormData) => {
    const formData = new FormData();

    formData.append("name", data.name);

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    const isSubCat = data.category_id && data.category_id !== "none";

    if (isSubCat) {
      formData.append("category_id", data.category_id ?? "none");
    }

    try {
      if (isEditing && category) {
        // EDIT MODE
        if (isSubCat) {
          // Editing a subcategory
          await updateSubCategory({
            id: category.id,
            formData,
          });
        } else {
          // Editing a category
          await updateCategory({
            id: category.id,
            formData,
          });
        }
        console.log("Category updated successfully");
      } else {
        // CREATE MODE
        if (isSubCat) {
          // Creating a subcategory
          await createSubCategory(formData);
        } else {
          // Creating a category
          await createCategory(formData);
        }
        console.log("Category created successfully");
      }

      // Success actions
      setOpenCatalog(false);
      form.reset();
    } catch (error) {
      console.log("Category save failed:", error);
      // TODO: Show error toast
    }
  };

  return (
    <Dialog open={openCatalog} onOpenChange={setOpenCatalog}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit` : `New`} Category / Subcategory
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(saveCategory)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={isEditing ? category.name : `Name`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Parent Category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        None (Top-level Category)
                      </SelectItem>
                      {!isLoading &&
                        myCategories
                          // Prevent category from being its own parent
                          .filter((c) => !isEditing || c.id !== category?.id)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only use this when creating a sub-category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail" // Or "files" for multiple files
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(event) => {
                        onChange(
                          event.target.files ? event.target.files[0] : undefined
                        ); // For single file
                        // Or for multiple files:
                        // onChange(Array.from(event.target.files || []));
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-4 w-full" type="submit">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryDialogZod2;
