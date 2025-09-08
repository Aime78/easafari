import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash, Eye } from "lucide-react";

export default function MarketDashboard() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  //const [openOrder, setOpenOrder] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Market Management</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." className="w-64" />
          <Button variant="outline">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Categories */}
        <TabsContent value="categories">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <Dialog open={openCategory} onOpenChange={setOpenCategory}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> New Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Category</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Category Name" />
                    <Button className="mt-4">Save</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead># Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Safaris</TableCell>
                    <TableCell>01 Aug 2025</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hotels</TableCell>
                    <TableCell>15 Jul 2025</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subcategories */}
        <TabsContent value="subcategories">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Subcategories</h2>
                <Dialog
                  open={openSubCategory}
                  onOpenChange={setOpenSubCategory}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> New Subcategory
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Subcategory</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Subcategory Name" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="safaris">Safaris</SelectItem>
                        <SelectItem value="hotels">Hotels</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="mt-4">Save</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subcategory Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead># Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Luxury Safari</TableCell>
                    <TableCell>Safaris</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-4 items-center">
                <h2 className="text-lg font-semibold">Products</h2>
                <Dialog open={openProduct} onOpenChange={setOpenProduct}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>New Product</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Product Name" />
                    <Textarea placeholder="Description" />
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
                    <Input placeholder="Stock" type="number" />
                    <Input type="file" />
                    <Button className="mt-4">Save</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-2 mb-4">
                <Input placeholder="Search products..." />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safaris">Safaris</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Subcategory</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="w-10 h-10 bg-gray-200" />
                    </TableCell>
                    <TableCell>Gorilla Trek</TableCell>
                    <TableCell>Safaris</TableCell>
                    <TableCell>Luxury</TableCell>
                    <TableCell>$500</TableCell>
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
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Gorilla Trek</TableCell>
                    <TableCell>$500</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
