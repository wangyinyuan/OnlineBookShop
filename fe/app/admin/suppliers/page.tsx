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
import {
  addSupplierReq,
  getSuppliersReq,
  suppliersPath,
  updateSupplierReq,
} from "@/apis/supplier";
import useSWR from "swr";
import { Loader } from "@/app/components/Loader";

export default function SupplierManagement() {
  const { toast } = useToast();
  const [newSupplier, setNewSupplier] = useState({ name: "", contactInfo: "" });
  const [tempValues, setTempValues] = useState<
    Record<
      number,
      {
        name: string;
        contactInfo: string;
      }
    >
  >({});

  const {
    data: suppliers,
    isLoading,
    mutate,
  } = useSWR(suppliersPath, () => getSuppliersReq());

  const handleAddSupplier = async () => {
    await addSupplierReq(newSupplier);
    toast({ title: "Success", description: "Supplier added successfully!" });
    mutate();
    setNewSupplier({ name: "", contactInfo: "" });
  };

  const handleUpdateSupplier = async (id: number) => {
    const tempValue = tempValues[id];
    if (!tempValue) return;

    await updateSupplierReq(id, tempValue);
    toast({
      title: "Success",
      description: "Supplier updated successfully!",
    });
    setTempValues((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    mutate();
  };

  if (isLoading) return <Loader />;

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
          {suppliers?.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.contactInfo}</TableCell>
              <TableCell className="flex items-center">
                <Input
                  value={tempValues[supplier.id]?.name ?? supplier.name}
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [supplier.id]: {
                        ...prev[supplier.id],
                        name: e.target.value,
                      },
                    }))
                  }
                  className="mr-2"
                />
                <Input
                  value={
                    tempValues[supplier.id]?.contactInfo ?? supplier.contactInfo
                  }
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [supplier.id]: {
                        ...prev[supplier.id],
                        contactInfo: e.target.value,
                      },
                    }))
                  }
                  className="mr-2"
                />
                <Button
                  onClick={() => handleUpdateSupplier(supplier.id)}
                  disabled={!tempValues[supplier.id]}>
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
