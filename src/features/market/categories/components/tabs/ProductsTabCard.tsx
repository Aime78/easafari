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

import { Plus, Eye, Trash, Edit, RotateCcw } from "lucide-react";

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
  const [filters, setFilters] = useState({
    storeId: "all",
    category: "all",
    sortBy: "",
  });

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let filteredProducts = [...products];

    if (searchQuery.trim() !== "") {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.storeId !== "all") {
      filteredProducts = filteredProducts.filter(
        (prod) => prod.store_id.toString() === filters.storeId
      );
    }

    if (filters.category !== "all") {
      filteredProducts = filteredProducts.filter(
        (prod) => prod.category_id.toString() === filters.category
      );
    }

    if (filters.sortBy === "newest") {
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sortBy === "oldest") {
      filteredProducts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (filters.sortBy === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filteredProducts);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: string, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      storeId: "all",
      category: "all",
      sortBy: "",
    });
  };

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
          <Select
            value={filters.storeId.toString()}
            onValueChange={(value) => handleFilterChange("storeId", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((s) => (
                <SelectItem value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(val) => handleFilterChange("category", val)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(val) => handleFilterChange("sortBy", val)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw />
          </Button>
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
