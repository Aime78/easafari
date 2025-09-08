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
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash,
  Eye,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function MarketDashboard() {
  const [openStore, setOpenStore] = useState(false);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  // Track expanded categories in Catalog
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Market Management</h1>

      <Tabs defaultValue="stores">
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Stores */}
        <TabsContent value="stores">
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
                <Input placeholder="Search stores..." className="sm:max-w-sm" />
                <select className="border rounded-md px-3 py-2 text-sm">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                  <option>Sort by: Most Products</option>
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
                  <TableRow>
                    <TableCell>Safari Hub</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>01 Aug 2025</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Safari Hub Store details</DialogTitle>
                          </DialogHeader>

                          <p>
                            <strong>Created On:</strong> 1/5/2024
                          </p>
                          <h3 className="mt-4 font-semibold">Products</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>1</li>
                            <li>2</li>
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

                            <Input placeholder="Store Name" />
                            <Textarea placeholder="Description" />
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
                              This action cannot be undone. This will
                              permanently delete your store.
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
                  <TableRow>
                    <TableCell>Urban Mart</TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>15 Jul 2025</TableCell>
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
                  <TableRow>
                    <TableCell>Fresh Valley</TableCell>
                    <TableCell>52</TableCell>
                    <TableCell>02 Jun 2025</TableCell>
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
                  <TableRow>
                    <TableCell>Electro World</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>28 May 2025</TableCell>
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
                  <TableRow>
                    <TableCell>Style Loft</TableCell>
                    <TableCell>31</TableCell>
                    <TableCell>12 May 2025</TableCell>
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

        {/* Catalog (Categories + Subcategories in tree view) */}
        <TabsContent value="catalog">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Catalog</h2>
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
                        <SelectItem value="safaris">Safaris</SelectItem>
                        <SelectItem value="hotels">Hotels</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="file" /> {/* thumbnail upload */}
                    <Button className="mt-4">Save</Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead className="min-w-44">Catalog</TableHead>
                    <TableHead># Products</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Category row */}
                  <TableRow>
                    <TableCell>
                      <div className="w-10 h-10 bg-gray-200 rounded" />{" "}
                      {/* placeholder */}
                    </TableCell>
                    <TableCell
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleExpand("safaris")}
                    >
                      {expanded["safaris"] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold">Safaris</span>
                    </TableCell>
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
                  {expanded["safaris"] && (
                    <TableRow>
                      <TableCell>
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      </TableCell>
                      <TableCell className="pl-8">Luxury Safari</TableCell>
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
                  )}
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
                    <Input
                      placeholder="Rating (0-5)"
                      type="number"
                      step="0.1"
                    />
                    <Input placeholder="Stock" type="number" />
                    <Input type="file" />
                    <Button className="mt-4">Save</Button>
                  </DialogContent>
                </Dialog>
              </div>

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
                  <TableRow>
                    <TableCell>
                      <div className="w-10 h-10 bg-gray-200" />
                    </TableCell>
                    <TableCell>Gorilla Trek</TableCell>
                    <TableCell>Safari Hub</TableCell>
                    <TableCell>Safaris</TableCell>
                    <TableCell>Luxury</TableCell>
                    <TableCell>$500</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>4.5 ⭐</TableCell>
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
                    <TableHead>User ID</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Delivery Fee</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>#1001</TableCell>
                    <TableCell>user_001</TableCell>
                    <TableCell>Mobile Money</TableCell>
                    <TableCell>10,000</TableCell>
                    <TableCell>3,000</TableCell>
                    <TableCell>13,000</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order #1001</DialogTitle>
                          </DialogHeader>
                          <p>
                            <strong>Customer:</strong> John Doe
                          </p>
                          <p>
                            <strong>Address:</strong> jknjknjlnljnkn
                          </p>
                          <h3 className="mt-4 font-semibold">Items</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Product ID: 1 | Qty: 1 | Size: 3XL | Color: Fuscia
                            </li>
                            <li>
                              Product ID: 2 | Qty: 2 | Size: 2XL | Color: Yellow
                            </li>
                          </ul>
                        </DialogContent>
                      </Dialog>
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
