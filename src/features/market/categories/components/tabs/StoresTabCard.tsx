import { useEffect, useState } from "react";

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

import { Plus, Eye, Trash, Edit } from "lucide-react";

import { stores } from "../../data/dummyData";

const StoresTabCard = () => {
  const [openStore, setOpenStore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStores, setFilteredStores] = useState(stores);

  const [sortMethod, setSortMethod] = useState("newest");

  useEffect(() => {
    let storeList = [...stores];

    if (searchQuery.trim() !== "") {
      storeList = storeList.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortMethod === "newest") {
      storeList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortMethod === "oldest") {
      storeList.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortMethod === "most") {
      storeList.sort((a, b) => b.products.length - a.products.length);
    }

    setFilteredStores(storeList);
  }, [searchQuery, sortMethod]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header + Create Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Stores</h2>
          <Dialog open={openStore} onOpenChange={setOpenStore}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> New Store
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Store</DialogTitle>
              </DialogHeader>
              <Input placeholder="Store Name" />
              <Textarea placeholder="Description" />
              <Input type="file" />
              <Button className="mt-4">Save</Button>
            </DialogContent>
          </Dialog>
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
            <option value="most">Sort by: Most Products</option>
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
            {filteredStores.map((store) => (
              <TableRow>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.products.length}</TableCell>
                <TableCell>{store.createdAt}</TableCell>
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

                      <p>
                        <strong>Created On:</strong> {store.createdAt}
                      </p>
                      <h3 className="mt-4 font-semibold">Products</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {store.products.map((p) => (
                          <li>{p}</li>
                        ))}
                      </ul>
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

                        <Input placeholder={store.name} />
                        <Textarea placeholder={store.description} />
                        <Input type="file" />

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
                          delete your store.
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StoresTabCard;
