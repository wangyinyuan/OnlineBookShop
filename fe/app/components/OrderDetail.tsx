"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // 在实际应用中，这里应该从API获取订单详情
    const mockOrder: Order = {
      id: parseInt(orderId),
      date: "2023-06-01",
      total: 29.97,
      status: "Delivered",
      items: [
        { id: 1, title: "The Great Gatsby", quantity: 1, price: 9.99 },
        { id: 2, title: "To Kill a Mockingbird", quantity: 2, price: 9.99 },
      ],
      shippingAddress: "123 Main St, Anytown, AN 12345",
    };
    setOrder(mockOrder);
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{order.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Information</h2>
            <p>
              <strong>Date:</strong> {order.date}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p>{order.shippingAddress}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline">Print Order</Button>
        </div>
      </CardContent>
    </Card>
  );
}
