import { Button } from "@/components/ui/button";
import type { Product } from "@/features/market/types/marketTypes";
import { Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useSingleProductQuery } from "../hooks/useProducts";

const ProductDetailsDialog = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { productDetails, similarProducts, isLoading } = useSingleProductQuery(
    product.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            #{productDetails?.id} - {productDetails?.name}
          </DialogTitle>
          <DialogDescription>{productDetails?.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Store id:</strong> {productDetails?.store_id}
          </p>
          <p>
            <strong>cat id:</strong> {productDetails?.category_id}
          </p>
          <p>
            <strong>quantity:</strong> {productDetails?.quantity}
          </p>
          <p>
            <strong>discount:</strong> {productDetails?.discount_price}
          </p>
        </div>

        <h3 className="mt-4 font-semibold">Similar Products</h3>
        {isLoading && (
          <ul className="list-disc pl-5 space-y-1">
            <p className="text-gray-500">Loading...</p>
          </ul>
        )}
        {!isLoading && similarProducts && similarProducts.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {similarProducts.map((product, index) => (
              <li key={index}>{product.name}</li>
            ))}
          </ul>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            <p className="text-gray-500">No products added yet</p>
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ProductDetailsDialog;
