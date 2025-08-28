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

import { Plus, Eye, Trash, Edit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  stores,
  categories,
  subCategories,
  products,
} from "../../data/dummyData";

const ProductsTabCard = () => {
  const [openProduct, setOpenProduct] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let searched = [...products];

    if (searchQuery.trim() !== "") {
      searched = searched.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(searched);
  }, [searchQuery]);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Top bar with search and add */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          {/* Search box */}
          <h2 className="text-lg font-semibold">Products</h2>

          {/* Add Product */}
          <Dialog open={openProduct} onOpenChange={setOpenProduct}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Product</DialogTitle>
              </DialogHeader>
              <Input placeholder="Product Name" />
              <Textarea placeholder="Description" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safarihub">Safari Hub</SelectItem>
                  <SelectItem value="explorer">Explorer Deals</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safaris">Safaris</SelectItem>
                  <SelectItem value="hotels">Hotels</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Price" type="number" />
              <Input placeholder="Discount (%)" type="number" />
              <Input placeholder="Rating (0-5)" type="number" step="0.1" />
              <Input placeholder="Stock" type="number" />
              <Input type="file" />
              <Button className="mt-4">Save</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 mb-4 justify-between">
          <Input
            placeholder="Search products..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((s) => (
                <SelectItem value={s.name.toLowerCase()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ & up</SelectItem>
              <SelectItem value="3">⭐⭐⭐ & up</SelectItem>
            </SelectContent>
          </Select>

          <select className="border rounded-md px-3 py-2 text-sm">
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="most">Sort by: Most Products</option>
          </select>
        </div>

        {/* Products Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow>
                <TableCell>
                  <div className="w-10 h-10 bg-gray-200 rounded" />
                </TableCell>
                <TableCell>{p.name}</TableCell>{" "}
                {/* todo truncate to limit expansion*/}
                <TableCell>
                  {stores.find((s) => s.id === p.store_id)?.name || "No store"}
                </TableCell>
                <TableCell>
                  <Badge>
                    {categories.find((c) => c.id === p.category_id)?.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {
                      subCategories.find((sc) => sc.id === p.sub_category_id)
                        ?.name
                    }
                  </Badge>
                </TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.discount}%</TableCell>
                <TableCell>{p.rating} ⭐</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsTabCard;
