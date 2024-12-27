"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import {
  deleteCartReq,
  getCartsPath,
  getCartsReq,
  updateCartReq,
} from "@/apis/cart";
import { Loader } from "@/app/components/Loader";

export function CartContent() {
  const { data, isLoading, mutate } = useSWR(getCartsPath, () => getCartsReq());
  const { toast } = useToast();

  const updateQuantity = async (id: number, newQuantity: number) => {
    await updateCartReq(id, newQuantity);
    await mutate();
    toast({
      title: "Success",
      description: "Cart updated successfully",
    });
  };

  const removeItem = async (id: number) => {
    await deleteCartReq(id);
    await mutate();
    toast({
      title: "Success",
      description: "Item removed from cart",
    });
  };
  const calculateTotal = () => {
    return data.total || 0;
  };

  if (isLoading) {
    return <Loader />;
  }

  const cartItems = data.items || [];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item: CartItem) => (
            <TableRow key={item.cart_id}>
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
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.cart_id, parseInt(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => removeItem(item.cart_id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">
          Total: ${calculateTotal().toFixed(2)}
        </p>
        <Button size="lg">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
