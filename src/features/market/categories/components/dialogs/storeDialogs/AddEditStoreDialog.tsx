import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Plus, Edit } from "lucide-react";

import {
  useCreateStoreMutation,
  useUpdateStoreMutation,
} from "../../../hooks/useStores";
import { useState } from "react";
import { storeSchema } from "../../../schemas/marketSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { Store } from "../../../types/marketTypes";

type StoreFormData = z.infer<typeof storeSchema>;

type AddEditStoreDialogProps = {
  store?: Store;
};

const AddEditStoreDialog = ({ store }: AddEditStoreDialogProps) => {
  const isEditing = !!store;

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: isEditing
      ? {
          name: store.name,
          description: store.description,
          address: store.address,
          latitude: store.latitude,
          longitude: store.longitude,
          opening_hours: store.opening_hours,
        }
      : {
          name: "",
          description: "",
          address: "",
          latitude: "",
          longitude: "",
          opening_hours: "",
        },
  });

  const { mutateAsync: createStore } = useCreateStoreMutation();
  const { mutateAsync: updateStore } = useUpdateStoreMutation();

  const [openStore, setOpenStore] = useState(false);

  const handleSaveStore = async (data: StoreFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("opening_hours", data.opening_hours);

    if (isEditing) {
      await updateStore(
        { id: Number(store.id), formData },
        {
          onSuccess: () => {
            form.reset();
            //todo show toast
            setOpenStore(false);
            console.log("Store updated successfully!");
          },
          onError: (error) => {
            console.log("Error updating store:", error);
            //todo show toast
          },
        }
      );
    } else {
      // Use the mutation - it handles success/error states automatically
      await createStore(formData, {
        onSuccess: () => {
          form.reset();
          //todo show toast
          setOpenStore(false);
          console.log("Store created successfully!");
        },
        onError: (error) => {
          console.log("Error creating store:", error);
          //todo show toast
        },
      });
    }
  };

  return (
    <Dialog open={openStore} onOpenChange={setOpenStore}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Store
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "New"} Store</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSaveStore)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Store Name" {...field} />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Latitude" type="number" {...field} />
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
                  <FormControl>
                    <Input placeholder="Longitude" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="opening_hours"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Opening hours" {...field} />
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

export default AddEditStoreDialog;
