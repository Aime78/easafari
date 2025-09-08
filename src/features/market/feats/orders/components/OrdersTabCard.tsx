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

import { Eye } from "lucide-react";

import { orders } from "../../../lib/data/dummyData";

const OrdersTabCard = () => {
  return (
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
            {orders.map((order) => (
              <TableRow>
                <TableCell>#{order.id}</TableCell>
                <TableCell>user_{order.userId}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.subTotal}</TableCell>
                <TableCell>{order.deliveryFee}</TableCell>
                <TableCell>{order.subTotal + order.deliveryFee}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order #{order.id}</DialogTitle>
                      </DialogHeader>
                      <p>
                        <strong>Customer #:</strong> {order.userId}
                      </p>
                      <p>
                        <strong>Address:</strong> {order.address}
                      </p>
                      <h3 className="mt-4 font-semibold">Items</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {order.items.map((i) => (
                          <li>
                            Product ID: {i.product_id} | Qty: {i.quantity} |
                            Size: {i.size} | Color:
                            {i.color}
                          </li>
                        ))}
                      </ul>
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

export default OrdersTabCard;
