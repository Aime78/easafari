import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Eye, Trash, Edit } from "lucide-react";

import { useStoreQuery } from "../../../hooks/useStores";
import AddEditStoreDialog from "../../dialogs/storeDialogs/AddEditStoreDialog";

const StoresTabCard2 = () => {
  const { stores, isLoading } = useStoreQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState("newest");

  const filteredStores = useMemo(() => {
    let storeList = [...stores];

    if (searchQuery.trim() !== "") {
      storeList = storeList.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort logic - FIXED: Handle cases where fields might be undefined
    if (sortMethod === "newest") {
      storeList.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Newest first
      });
    } else if (sortMethod === "oldest") {
      storeList.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateA - dateB; // Oldest first
      });
    } /* else if (sortMethod === "most") {
      storeList.sort((a, b) => {
        const aProducts = a.products?.length || 0;
        const bProducts = b.products?.length || 0;
        return bProducts - aProducts; // Most products first
      });
    }*/

    return storeList;
  }, [stores, searchQuery, sortMethod]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header + Create Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Stores</h2>

          <AddEditStoreDialog />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <Input
            placeholder="Search stores..."
            className="sm:max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            {/* <option value="most">Sort by: Most Products</option>*/}
          </select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead># Products</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStores.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No stores found. Create your first store to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>0</TableCell>
                  {/* Safe fallback since products might not exist */}
                  <TableCell>
                    {new Date(store.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{store.name} Store details</DialogTitle>
                          <DialogDescription>
                            {store.description}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                          <p>
                            <strong>Address:</strong> {store.address}
                          </p>
                          <p>
                            <strong>Opening Hours:</strong>{" "}
                            {store.opening_hours}
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
                        {/*store.products && store.products.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {store.products.map((product, index) => (
                              <li key={index}>{product.name || product}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No products added yet</p>
                        ) */}
                        <p className="text-gray-500">No products added yet</p>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <form>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit store</DialogTitle>
                          </DialogHeader>

                          <Input
                            defaultValue={store.name}
                            placeholder="Store Name"
                          />
                          <Textarea
                            defaultValue={store.description}
                            placeholder="Description"
                          />
                          <Input
                            defaultValue={store.address}
                            placeholder="Address"
                          />
                          <Input
                            defaultValue={store.latitude}
                            placeholder="Latitude"
                            type="number"
                          />
                          <Input
                            defaultValue={store.longitude}
                            placeholder="Longitude"
                            type="number"
                          />
                          <Input
                            defaultValue={store.opening_hours}
                            placeholder="Opening Hours"
                          />

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger>
                        <Button size="sm" variant="destructive">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete "{store.name}" store.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" variant="destructive">
                            Yes, delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StoresTabCard2;
