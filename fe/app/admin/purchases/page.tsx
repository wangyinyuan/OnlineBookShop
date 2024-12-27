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

interface PurchaseOrder {
  id: number;
  supplier: string;
  book: string;
  quantity: number;
  status: string;
}

export default function PurchaseManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [newPurchaseOrder, setNewPurchaseOrder] = useState({
    supplier: "",
    book: "",
    quantity: 0,
  });

  useEffect(() => {
    // Fetch purchase orders from API
    // For now, we'll use mock data
    setPurchaseOrders([
      {
        id: 1,
        supplier: "Supplier A",
        book: "The Great Gatsby",
        quantity: 100,
        status: "Pending",
      },
      {
        id: 2,
        supplier: "Supplier B",
        book: "To Kill a Mockingbird",
        quantity: 50,
        status: "Delivered",
      },
    ]);
  }, []);

  const handleAddPurchaseOrder = () => {
    // Add purchase order to API
    // For now, we'll just add it to the local state
    setPurchaseOrders([
      ...purchaseOrders,
      { ...newPurchaseOrder, id: purchaseOrders.length + 1, status: "Pending" },
    ]);
    setNewPurchaseOrder({ supplier: "", book: "", quantity: 0 });
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    // Update status in API
    // For now, we'll just update the local state
    setPurchaseOrders(
      purchaseOrders.map((po) =>
        po.id === id ? { ...po, status: newStatus } : po
      )
    );
  };

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
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((po) => (
            <TableRow key={po.id}>
              <TableCell>{po.supplier}</TableCell>
              <TableCell>{po.book}</TableCell>
              <TableCell>{po.quantity}</TableCell>
              <TableCell>{po.status}</TableCell>
              <TableCell>
                <select
                  value={po.status}
                  onChange={(e) => handleUpdateStatus(po.id, e.target.value)}
                  className="mr-2 p-2 border rounded">
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <Button onClick={() => handleUpdateStatus(po.id, po.status)}>
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
