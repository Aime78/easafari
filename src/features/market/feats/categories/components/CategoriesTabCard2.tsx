import { useState, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronRight, ChevronDown } from "lucide-react";

import { products } from "../../../lib/data/dummyData";
import { useCategoryQuery } from "../hooks/useCategories";
import AddEditCategoryDialogZod2 from "./AddEditCategoryDialogZod2";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import CategoryDetailsDialog from "./CategoryDetailsDialog";

const CategoriesTabCard2 = () => {
  const { myCategories, isLoading } = useCategoryQuery();

  const [searchQuery, setSearchQuery] = useState("");

  // Track expanded categories in Catalog
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredCats = useMemo(() => {
    let catList = [...myCategories];

    if (searchQuery.trim() !== "") {
      catList = catList.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return catList;
  }, [searchQuery, myCategories]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <AddEditCategoryDialogZod2 />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <Input
            placeholder="Search categories..."
            className="sm:max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Sort by: Name (A–Z)</option>
            <option>Sort by: Name (Z–A)</option>
            <option>Sort by: Most Products</option>
          </select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead className="min-w-44">Category</TableHead>
              <TableHead># Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading skeleton */}
            {isLoading && (
              <>
                {[...Array(4)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-8" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}

            {/* Empty state */}
            {!isLoading && myCategories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p className="text-lg font-medium">No categories found</p>
                    <p className="text-sm">Add a new category to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Category rows */}
            {!isLoading &&
              filteredCats?.map((cat) => (
                <>
                  <TableRow key={cat.id}>
                    <TableCell>
                      {cat.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}/${
                            cat.image
                          }`}
                          alt={cat.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      )}
                    </TableCell>
                    <TableCell
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleExpand(cat.name.toLowerCase())}
                    >
                      {expanded[cat.name.toLowerCase()] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold">{cat.name}</span>
                    </TableCell>
                    <TableCell>
                      {
                        products.filter(
                          (p) =>
                            p.category_id === cat.id ||
                            p.sub_category_id === cat.id
                        ).length
                      }
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <CategoryDetailsDialog category={cat} />
                      <AddEditCategoryDialogZod2 category={cat} />
                      <DeleteCategoryDialog category={cat} />
                    </TableCell>
                  </TableRow>

                  {/* Expanded subcategories */}
                  {expanded[cat.name.toLowerCase()] &&
                    (cat.sub_categories && cat.sub_categories.length > 0 ? (
                      cat.sub_categories.map((sc) => (
                        <TableRow key={sc.id} className="bg-gray-50/50">
                          <TableCell>
                            <div className="w-10 h-10 bg-gray-200 rounded" />
                          </TableCell>
                          <TableCell className="pl-8">{sc.name}</TableCell>
                          <TableCell>
                            {
                              products.filter(
                                (p) => p.sub_category_id === sc.id
                              ).length
                            }
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <CategoryDetailsDialog category={sc} />
                            <AddEditCategoryDialogZod2 category={sc} />
                            <DeleteCategoryDialog category={sc} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="bg-gray-50/50">
                        <TableCell colSpan={4} className="h-20 text-center">
                          <p className="text-sm text-muted-foreground">
                            No subcategories found
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoriesTabCard2;
