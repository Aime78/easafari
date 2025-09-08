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

import { Trash, ChevronRight, ChevronDown, Edit } from "lucide-react";

import { products } from "../../../data/dummyData";
import AddEditCategoryDialog from "../../dialogs/categoryDialogs/AddEditCategoryDialog";
import { useCategoryQuery } from "../../../hooks/useCategories";
import AddEditCategoryDialogZod2 from "../../dialogs/categoryDialogs/AddEditCategoryDialogZod2";

const CategoriesTabCard2 = () => {
  const { myCategories, isLoading } = useCategoryQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(myCategories);
  // Track expanded categories in Catalog
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  useEffect(() => {
    let catList = [...myCategories];

    if (searchQuery.trim() !== "") {
      catList = catList.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(catList);
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
            {/* Category row */}

            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Loading categories...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && myCategories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No categories found
                </TableCell>
              </TableRow>
            )}

            {filteredCategories?.map((cat) => (
              <>
                <TableRow>
                  <TableCell>
                    <div className="w-10 h-10 bg-gray-200 rounded" />
                    {/* placeholder */}
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
                      ).length //todo fix to get total count for cat and sub count
                    }
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <AddEditCategoryDialog category={cat} />
                    <Button size="sm" variant="destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded[cat.name.toLowerCase()] &&
                  (cat.sub_categories && cat.sub_categories.length > 0 ? (
                    cat.sub_categories.map((sc) => (
                      <TableRow key={sc.id}>
                        <TableCell>
                          <div className="w-10 h-10 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell className="pl-8">{sc.name}</TableCell>
                        <TableCell>
                          {
                            products.filter((p) => p.sub_category_id === sc.id)
                              .length
                          }
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        No subcategories found
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
