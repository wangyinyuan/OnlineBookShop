"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import {
  createPurchaseOrderReq,
  getPurchaseOrdersReq,
  purchaseOrdersPath,
  updatePurchaseOrderStatusReq,
} from "@/apis/book";
import { Loader } from "@/app/components/Loader";
import { formatDate } from "@/utils";

export default function PurchaseManagement() {
  const { toast } = useToast();
  const [newPurchaseOrder, setNewPurchaseOrder] = useState({
    supplier: "",
    book: "",
    quantity: 0,
  });
  const [tempStatus, setTempStatus] = useState<Record<number, string>>({});

  const {
    data: purchaseOrders,
    isLoading,
    mutate,
  } = useSWR(purchaseOrdersPath, () => getPurchaseOrdersReq());

  const handleAddPurchaseOrder = async () => {
    await createPurchaseOrderReq(newPurchaseOrder);
    toast({ title: "Success", description: "Purchase order created!" });
    mutate();
    setNewPurchaseOrder({ supplier: "", book: "", quantity: 0 });
  };

  const handleUpdateStatus = async (id: number) => {
    const newStatus = tempStatus[id];
    if (
      !newStatus ||
      newStatus === purchaseOrders?.find((po) => po.id === id)?.status
    ) {
      return;
    }

    try {
      await updatePurchaseOrderStatusReq(id, newStatus);
      toast({ title: "Success", description: "Status updated!" });
      setTempStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Purchase Management</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Create New Purchase Order</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Supplier"
            value={newPurchaseOrder.supplier}
            onChange={(e) =>
              setNewPurchaseOrder({
                ...newPurchaseOrder,
                supplier: e.target.value,
              })
            }
          />
          <Input
            placeholder="Book"
            value={newPurchaseOrder.book}
            onChange={(e) =>
              setNewPurchaseOrder({ ...newPurchaseOrder, book: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newPurchaseOrder.quantity}
            onChange={(e) =>
              setNewPurchaseOrder({
                ...newPurchaseOrder,
                quantity: parseInt(e.target.value),
              })
            }
          />
          <Button onClick={handleAddPurchaseOrder}>Create Order</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders?.map((po) => (
            <TableRow key={po.id}>
              <TableCell>{po.supplier}</TableCell>
              <TableCell>{po.book}</TableCell>
              <TableCell>{po.quantity}</TableCell>
              <TableCell>${po.price.toFixed(2)}</TableCell>
              <TableCell>{formatDate(po.orderDate)}</TableCell>
              <TableCell>{po.status}</TableCell>
              <TableCell className="flex gap-2">
                <select
                  value={tempStatus[po.id] ?? po.status}
                  onChange={(e) =>
                    setTempStatus((prev) => ({
                      ...prev,
                      [po.id]: e.target.value,
                    }))
                  }
                  className="mr-2 p-2 border rounded">
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <Button
                  onClick={() => handleUpdateStatus(po.id)}
                  disabled={
                    !tempStatus[po.id] || tempStatus[po.id] === po.status
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
