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
  customersPath,
  getCustomersReq,
  updateCustomerReq,
} from "@/apis/customer";
import { Loader } from "@/app/components/Loader";

export default function CustomerManagement() {
  const { toast } = useToast();
  const [tempValues, setTempValues] = useState<
    Record<
      number,
      {
        creditLevel: number;
        accountBalance: number;
      }
    >
  >({});

  const {
    data: customers,
    isLoading,
    mutate,
  } = useSWR(customersPath, () => getCustomersReq());

  const handleUpdateCustomer = async (id: number) => {
    const tempValue = tempValues[id];
    if (!tempValue) return;

    try {
      await updateCustomerReq(id, tempValue);
      toast({
        title: "Success",
        description: "Customer updated successfully!",
      });
      setTempValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Credit Level</TableHead>
            <TableHead>Account Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.creditLevel}</TableCell>
              <TableCell>${customer.accountBalance.toFixed(2)}</TableCell>
              <TableCell className="flex items-center">
                <Input
                  type="number"
                  value={
                    tempValues[customer.id]?.creditLevel ?? customer.creditLevel
                  }
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [customer.id]: {
                        ...prev[customer.id],
                        creditLevel: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-20 mr-2"
                />
                <Input
                  type="number"
                  value={
                    tempValues[customer.id]?.accountBalance ??
                    customer.accountBalance
                  }
                  onChange={(e) =>
                    setTempValues((prev) => ({
                      ...prev,
                      [customer.id]: {
                        ...prev[customer.id],
                        accountBalance: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-20 mr-2"
                />
                <Button
                  onClick={() => handleUpdateCustomer(customer.id)}
                  disabled={!tempValues[customer.id]}>
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
