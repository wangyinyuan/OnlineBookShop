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

interface Supplier {
  id: number;
  name: string;
  contactInfo: string;
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: "", contactInfo: "" });

  useEffect(() => {
    // Fetch suppliers from API
    // For now, we'll use mock data
    setSuppliers([
      { id: 1, name: "Supplier A", contactInfo: "supplierA@example.com" },
      { id: 2, name: "Supplier B", contactInfo: "supplierB@example.com" },
    ]);
  }, []);

  const handleAddSupplier = () => {
    // Add supplier to API
    // For now, we'll just add it to the local state
    setSuppliers([...suppliers, { ...newSupplier, id: suppliers.length + 1 }]);
    setNewSupplier({ name: "", contactInfo: "" });
  };

  const handleUpdateSupplier = (
    id: number,
    updatedSupplier: Partial<Supplier>
  ) => {
    // Update supplier in API
    // For now, we'll just update the local state
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Supplier Management</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Supplier</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Supplier Name"
            value={newSupplier.name}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, name: e.target.value })
            }
          />
          <Input
            placeholder="Contact Info"
            value={newSupplier.contactInfo}
            onChange={(e) =>
              setNewSupplier({ ...newSupplier, contactInfo: e.target.value })
            }
          />
          <Button onClick={handleAddSupplier}>Add Supplier</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.contactInfo}</TableCell>
              <TableCell className="flex items-center">
                <Input
                  value={supplier.name}
                  onChange={(e) =>
                    handleUpdateSupplier(supplier.id, { name: e.target.value })
                  }
                  className="mr-2"
                />
                <Input
                  value={supplier.contactInfo}
                  onChange={(e) =>
                    handleUpdateSupplier(supplier.id, {
                      contactInfo: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                <Button
                  onClick={() => handleUpdateSupplier(supplier.id, supplier)}>
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
