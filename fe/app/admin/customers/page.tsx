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

interface Customer {
  id: number;
  name: string;
  email: string;
  creditLevel: number;
  accountBalance: number;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Fetch customers from API
    // For now, we'll use mock data
    setCustomers([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        creditLevel: 3,
        accountBalance: 500,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        creditLevel: 2,
        accountBalance: 200,
      },
    ]);
  }, []);

  const handleUpdateCreditLevel = (id: number, newLevel: number) => {
    // Update credit level in API
    // For now, we'll just update the local state
    setCustomers(
      customers.map((customer) =>
        customer.id === id ? { ...customer, creditLevel: newLevel } : customer
      )
    );
  };

  const handleUpdateAccountBalance = (id: number, newBalance: number) => {
    // Update account balance in API
    // For now, we'll just update the local state
    setCustomers(
      customers.map((customer) =>
        customer.id === id
          ? { ...customer, accountBalance: newBalance }
          : customer
      )
    );
  };

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
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.creditLevel}</TableCell>
              <TableCell>${customer.accountBalance.toFixed(2)}</TableCell>
              <TableCell className="flex items-center">
                <Input
                  type="number"
                  value={customer.creditLevel}
                  onChange={(e) =>
                    handleUpdateCreditLevel(
                      customer.id,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-20 mr-2"
                />
                <Input
                  type="number"
                  value={customer.accountBalance}
                  onChange={(e) =>
                    handleUpdateAccountBalance(
                      customer.id,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 mr-2"
                />
                <Button
                  onClick={() => {
                    handleUpdateCreditLevel(customer.id, customer.creditLevel);
                    handleUpdateAccountBalance(
                      customer.id,
                      customer.accountBalance
                    );
                  }}>
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
