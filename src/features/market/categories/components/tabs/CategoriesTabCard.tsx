import { useState } from "react";

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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Plus, Trash, ChevronRight, ChevronDown, Edit } from "lucide-react";

import { categories, subCategories, products } from "../../data/dummyData";

const CategoriesTabCard = () => {
  const [openCatalog, setOpenCatalog] = useState(false);
  // Track expanded categories in Catalog
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Dialog open={openCatalog} onOpenChange={setOpenCatalog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Category / Subcategory</DialogTitle>
              </DialogHeader>
              <Input placeholder="Name" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Parent Category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    None (Top-level Category)
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem value={c.name.toLowerCase()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="file" /> {/* thumbnail upload */}
              <Button className="mt-4">Save</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
          <Input placeholder="Search categories..." className="sm:max-w-sm" />
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
            {categories.map((cat) => (
              <>
                <TableRow>
                  <TableCell>
                    <div className="w-10 h-10 bg-gray-200 rounded" />{" "}
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
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded[cat.name.toLowerCase()] &&
                  subCategories
                    .filter((s) => s.category_id === cat.id)
                    .map((sc) => (
                      <TableRow>
                        <TableCell>
                          <div className="w-10 h-10 bg-gray-200 rounded" />
                        </TableCell>
                        <TableCell className="pl-8">{sc.name}</TableCell>
                        <TableCell>
                          {
                            products.filter((p) => p.sub_category_id === sc.id)
                              ?.length
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
                    ))}{" "}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoriesTabCard;
