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
import { Loader } from "@/app/components/Loader";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import { getOrderDetailsPath, getOrderDetailsReq } from "@/apis/order";

interface OrderDetail {
  order_id: number;
  order_date: string;
  status: string;
  book_id: number;
  title: string;
  cover_image: string;
  quantity: number;
  price: number;
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data, isLoading } = useSWR(
    getOrderDetailsPath(parseInt(orderId)),
    () => getOrderDetailsReq(parseInt(orderId))
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <div>Order not found</div>;
  }

  const orderDetails = data as OrderDetail[];
  const firstItem = orderDetails[0];
  const total = orderDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{firstItem.order_id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Information</h2>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(firstItem.order_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {firstItem.status}
            </p>
            <p>
              <strong>Total:</strong> ${total.toFixed(2)}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p>Wuhan HUST</p>
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
                {orderDetails.map((item) => (
                  <TableRow key={item.book_id}>
                    <TableCell className="flex items-center gap-4">
                      {item.cover_image && (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="w-12 h-16 object-cover"
                        />
                      )}
                      {item.title}
                    </TableCell>
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
          <Button variant="outline" onClick={() => window.print()}>
            Print Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
