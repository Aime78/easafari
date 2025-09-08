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
} from "../../../hooks/useCategories";
import { categorySchema } from "../../../schemas/marketSchemas";
import type { Category } from "../../../marketTypes";

type CategoryData = {
  name: string;
  thumbnail?: File; // ✅ File or undefined
  category_id: string;
};

interface AddEditCategoryDialogProps {
  category?: Category;
}

const AddEditCategoryDialog = ({ category }: AddEditCategoryDialogProps) => {
  const [openCatalog, setOpenCatalog] = useState(false);
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: "",
    thumbnail: undefined,
    category_id: "none",
  });

  const isEditing = !!category;

  const { myCategories, isLoading } = useCategoryQuery();

  const { mutate: createCategory, isSuccess: isCategoryCreated } =
    useCreateCategoryMutation();

  const { mutate: createSubCategory, isSuccess: isSubCategoryCreated } =
    useCreateSubCategoryMutation();

  const saveCategory = () => {
    if (categoryData.name === "") {
      //show toast
      return;
    }

    const validated = categorySchema.safeParse({
      name: categoryData.name,
      thumbnail: undefined,
    });

    if (!validated.success) {
      const issues = validated.error.issues;

      issues.forEach((issue: any) => {
        console.log("field:", issue.path.join("."));
        console.log("message:", issue.message);
      });

      //show toast
      console.log("invalid schema: ", validated.error);
      return;
    }

    const formData = new FormData();

    formData.append("name", categoryData.name);

    if (categoryData.category_id !== "none") {
      formData.append("category_id", categoryData.category_id);
      createSubCategory(formData);
    } else {
      createCategory(formData);
    }

    if (isCategoryCreated || isSubCategoryCreated) {
      //show success toast

      setCategoryData({
        name: "",
        thumbnail: undefined,
        category_id: "none",
      });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //setThumbnailFile(file);
      setCategoryData((prev) => ({ ...prev, thumbnail: file }));
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
        <Input
          placeholder={isEditing ? category.name : `Name`}
          value={categoryData.name}
          onChange={(e) =>
            setCategoryData({ ...categoryData, name: e.target.value })
          }
        />
        <Select
          value={categoryData.category_id}
          onValueChange={(val) =>
            setCategoryData((prev) => ({
              ...prev,
              category_id: val,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Parent Category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Top-level Category)</SelectItem>
            {!isLoading &&
              myCategories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Input type="file" onChange={handleThumbnailChange} />{" "}
        {/* thumbnail upload */}
        <Button className="mt-4" onClick={saveCategory}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategoryDialog;
