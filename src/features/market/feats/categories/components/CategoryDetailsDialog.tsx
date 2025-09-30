import { Button } from "@/components/ui/button";
import type {
  Category,
  SubCategory,
} from "@/features/market/types/marketTypes";
import { Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import {
  useGetProductsByCategoryQuery,
  useGetProductsBySubCategoryQuery,
} from "../../products/hooks/useProducts";

type CategoryDetailsDialogProps = {
  category: Category | SubCategory;
};

const CategoryDetailsDialog = ({ category }: CategoryDetailsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { productsByCategory, isLoading } = useGetProductsByCategoryQuery(7);

  const { productsBySubCategory, isLoading: isSubCatLoading } =
    useGetProductsBySubCategoryQuery(15);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Products under {category.name}</DialogTitle>
          <DialogDescription>Uses get products by category</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {isSubCatLoading ? (
              <div>Loading...</div>
            ) : productsBySubCategory?.length ? (
              productsBySubCategory.map((product) => (
                <div key={product.id} className="mb-2">
                  {product.name}
                </div>
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
        </ScrollArea>

        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : productsByCategory?.length ? (
              productsByCategory.map((product) => (
                <div key={product.id} className="mb-2">
                  {product.name}
                </div>
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default CategoryDetailsDialog;
