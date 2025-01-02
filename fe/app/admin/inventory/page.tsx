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
import useSWR from "swr";
import {
  addInventoryReq,
  getInventoryReq,
  inventoryPath,
  updateInventoryReq,
} from "@/apis/book";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/app/components/Loader";

export default function InventoryManagement() {
  const { toast } = useToast();
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    stock: 0,
  });
  const {
    data: books,
    isLoading,
    mutate,
  } = useSWR(inventoryPath, () => getInventoryReq());
  const [tempStocks, setTempStocks] = useState<Record<number, number>>({});

  const handleAddBook = async () => {
    await addInventoryReq(newBook);
    toast({ title: "Success", description: "New book added!" });
    mutate();
    setNewBook({ title: "", author: "", isbn: "", stock: 0 });
  };

  const handleUpdateStock = async (id: number) => {
    const newStock = tempStocks[id];
    if (newStock === undefined) {
      return;
    }
    await updateInventoryReq(id, newStock);
    toast({ title: "Success", description: "Inventory updated!" });
    setTempStocks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    mutate();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Book</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <Input
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <Input
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newBook.stock}
            onChange={(e) =>
              setNewBook({ ...newBook, stock: parseInt(e.target.value) })
            }
          />
          <Button onClick={handleAddBook}>Add Book</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell className="flex gap-2">
                <Input
                  type="number"
                  value={tempStocks[book.id] ?? book.stock}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setTempStocks((prev) => ({
                      ...prev,
                      [book.id]: value,
                    }));
                  }}
                  className="w-20 mr-2"
                />
                <Button
                  onClick={() => handleUpdateStock(book.id)}
                  disabled={
                    tempStocks[book.id] === undefined ||
                    tempStocks[book.id] === book.stock
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
