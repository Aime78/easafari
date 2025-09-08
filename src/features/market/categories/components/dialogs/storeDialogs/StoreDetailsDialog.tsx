import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";

import type { Store } from "../../../types/marketTypes";
import { useStoreDetailsQuery } from "../../../hooks/useStores";
import { useState } from "react";

const StoreDetailsDialog = ({ store }: { store: Store }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { storeDetails, isLoading } = useStoreDetailsQuery(store.id, {
    enabled: isOpen,
  });

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
            #{store.id} - {store.name}
          </DialogTitle>
          <DialogDescription>{store.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Address:</strong> {store.address}
          </p>
          <p>
            <strong>Opening Hours:</strong> {store.opening_hours}
          </p>
          <p>
            <strong>Latitude:</strong> {store.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {store.longitude}
          </p>
          <p>
            <strong>Created On:</strong>{" "}
            {new Date(store.created_at).toLocaleDateString()}
          </p>
        </div>

        <h3 className="mt-4 font-semibold">Products</h3>
        {isLoading && (
          <ul className="list-disc pl-5 space-y-1">
            <p className="text-gray-500">Loading...</p>
          </ul>
        )}
        {!isLoading &&
        storeDetails?.products &&
        storeDetails.products.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {storeDetails.products.map((product, index) => (
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

export default StoreDetailsDialog;
