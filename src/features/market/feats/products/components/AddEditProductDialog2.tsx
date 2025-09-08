import { useState } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Edit } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { Product } from "../../../types/marketTypes";
import { productFormSchema } from "@/features/market/lib/schemas/marketSchemas";
import { useStoreQuery } from "../../stores/hooks/useStores";
import { useCategoryQuery } from "../../categories/hooks/useCategories";
import { colorOptions, sizeOptions } from "../lib/myData";
import { useCreateProduct } from "../hooks/useProducts";

interface AddEditProductDialog2Props {
  product?: Product;
}

type ProductFormData = z.infer<typeof productFormSchema>;

const AddEditProductDialog2 = ({ product }: AddEditProductDialog2Props) => {
  const { mutateAsync: createNewProduct } = useCreateProduct();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: "",
      price: "",
      sub_category_id: "",
      store_id: "",
      thumbnail: undefined,
      discount: "",
      colors: [],
      sizes: [],
    },
  });

  const { stores, isLoading } = useStoreQuery();
  const { myCategories } = useCategoryQuery();

  //todo convert this to shadcn controlled form with zod validation schema
  //todo and use tanstack query for it
  const [openProduct, setOpenProduct] = useState(false);

  const isCreatingProduct = !product;

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("price", data.price);
    formData.append("sub_category_id", data.sub_category_id);
    formData.append("store_id", data.store_id);
    formData.append("discount", data.discount);

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    } else {
      formData.append("thumbnail", ""); // backend gets empty string
    }

    if (data?.colors && data.colors.length > 0) {
      //data.colors.forEach((color) => formData.append("colors[]", color));
      formData.append("colors", JSON.stringify(data.colors));
    }

    if (data?.sizes && data.sizes.length > 0) {
      formData.append("colors", JSON.stringify(data.sizes));
      //data.sizes.forEach((size) => formData.append("sizes[]", size));
    }

    // ✅ Log the formData entries
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    await createNewProduct(formData, {
      onSuccess: () => {
        form.reset();
        setOpenProduct(false);
        console.log("success crteated");
      },
      onError: () => {
        console.log("fail create");
      },
    });
  };

  return (
    <Dialog open={openProduct} onOpenChange={setOpenProduct}>
      <DialogTrigger asChild>
        {isCreatingProduct ? (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreatingProduct ? "New Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="store_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Store</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Select Store</SelectItem>
                      {!isLoading &&
                        stores.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sub_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Sub Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Select subcategory</SelectItem>
                      {!isLoading &&
                        myCategories.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="In stock" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Price" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="Discount" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizes"
              render={() => (
                <FormItem>
                  <FormLabel>Size Options</FormLabel>
                  {sizeOptions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="sizes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value ?? []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="colors"
              render={() => (
                <FormItem>
                  <FormLabel>Color Options</FormLabel>

                  {colorOptions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="colors"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value ?? []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail" // Or "files" for multiple files
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Add photo</FormLabel>
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

            <Button type="submit" className="mt-4 w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditProductDialog2;
