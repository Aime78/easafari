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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Eye, Trash, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { TruncatedCell } from "./TruncatedCell";
import { useStoreQuery } from "../../stores/hooks/useStores";
import { useProductsQuery } from "../hooks/useProducts";
import AddEditProductDialog2 from "./AddEditProductDialog2";
import {
  useCategoryQuery,
  useSubCategoryQuery,
} from "../../categories/hooks/useCategories";

const ProductsTabCard2 = () => {
  const { products, isLoading: isProductsLoading } = useProductsQuery();
  const { stores, isLoading: isStoresLoading } = useStoreQuery();
  const { myCategories, isLoading: isCatLoading } = useCategoryQuery();
  const { mySubCategories, isLoading: isSubCatLoading } = useSubCategoryQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    storeId: "all",
    category: "all",
    sortBy: "",
  });

  const filteredProducts = useMemo(() => {
    let filteredProd = [...products];

    if (searchQuery.trim() !== "") {
      filteredProd = filteredProd.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.storeId !== "all") {
      filteredProd = filteredProd.filter(
        (prod) => prod.store_id.toString() === filters.storeId
      );
    }

    if (filters.category !== "all") {
      filteredProd = filteredProd.filter(
        (prod) => prod.category_id.toString() === filters.category
      );
    }

    if (filters.sortBy === "newest") {
      filteredProd.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (filters.sortBy === "oldest") {
      filteredProd.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    /* else if (filters.sortBy === "rating") {
      filteredProd.sort((a, b) => b.rating - a.rating);
    }*/

    //setFilteredProd(filteredProd);
    return filteredProd;
  }, [searchQuery, filters, products]);

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
          <AddEditProductDialog2 />
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
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
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
              {!isCatLoading &&
                myCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
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
              {/*<SelectItem value="rating">Rating</SelectItem> */}
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
              {/*<TableHead>Rating</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isProductsLoading && <h2>loading...</h2>}
            {!isProductsLoading &&
              filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-gray-200 rounded" />
                  </TableCell>
                  <TruncatedCell maxLength={20}>{p.name}</TruncatedCell>
                  {/* todo truncate to limit expansion*/}
                  <TableCell>
                    {(!isStoresLoading &&
                      stores.find(
                        (s) => s.id.toString() === p.store_id.toString()
                      )?.name) ||
                      "No store"}
                  </TableCell>
                  <TableCell className="w-[130px] max-w-[130px]">
                    <div className="min-w-0">
                      <Badge
                        className="w-full justify-start"
                        title={
                          !isCatLoading
                            ? myCategories.find((c) => c.id === p.category_id)
                                ?.name
                            : ""
                        }
                      >
                        <span className="block truncate">
                          {!isCatLoading &&
                            myCategories.find((c) => c.id === p.category_id)
                              ?.name}
                        </span>
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="w-[120px] max-w-[120px]">
                    <div className="min-w-0">
                      <Badge
                        variant="secondary"
                        className="w-full justify-start"
                        title={
                          !isSubCatLoading
                            ? mySubCategories.find(
                                (sc) => sc.id === p.sub_category_id
                              )?.name
                            : ""
                        }
                      >
                        <span className="block truncate">
                          {!isSubCatLoading &&
                            mySubCategories.find(
                              (sc) => sc.id === p.sub_category_id
                            )?.name}
                        </span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>{p.discount_price || 0}%</TableCell>
                  {/*<TableCell>{p.rating} ⭐</TableCell> */}
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <AddEditProductDialog2 product={p} />

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

export default ProductsTabCard2;
