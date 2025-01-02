"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import {
  getAllOrdersPath,
  getAllOrdersReq,
  updateOrderStatusReq,
} from "@/apis/order";
import { Loader } from "@/app/components/Loader";

export default function OrderManagement() {
  const { toast } = useToast();
  const [tempStatus, setTempStatus] = useState<Record<number, string>>({});

  const {
    data: orders,
    isLoading,
    mutate,
  } = useSWR(getAllOrdersPath, () => getAllOrdersReq());

  const handleUpdateStatus = async (id: number) => {
    const newStatus = tempStatus[id];
    if (!newStatus || newStatus === orders?.find((o) => o.id === id)?.status) {
      return;
    }

    try {
      await updateOrderStatusReq(id, newStatus);
      toast({ title: "Success", description: "Order status updated!" });
      setTempStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <select
                  value={tempStatus[order.id] ?? order.status}
                  onChange={(e) =>
                    setTempStatus((prev) => ({
                      ...prev,
                      [order.id]: e.target.value,
                    }))
                  }
                  className="mr-2 p-2 border rounded">
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <Button
                  onClick={() => handleUpdateStatus(order.id)}
                  disabled={
                    !tempStatus[order.id] ||
                    tempStatus[order.id] === order.status
                  }>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
