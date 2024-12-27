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

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  stock: number;
}

export default function InventoryManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    stock: 0,
  });

  useEffect(() => {
    // Fetch books from API
    // For now, we'll use mock data
    setBooks([
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        stock: 50,
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780446310789",
        stock: 30,
      },
    ]);
  }, []);

  const handleAddBook = () => {
    // Add book to API
    // For now, we'll just add it to the local state
    setBooks([...books, { ...newBook, id: books.length + 1 }]);
    setNewBook({ title: "", author: "", isbn: "", stock: 0 });
  };

  const handleUpdateStock = (id: number, newStock: number) => {
    // Update stock in API
    // For now, we'll just update the local state
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, stock: newStock } : book
      )
    );
  };

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
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell className="flex gap-2">
                <Input
                  type="number"
                  value={book.stock}
                  onChange={(e) =>
                    handleUpdateStock(book.id, parseInt(e.target.value))
                  }
                  className="w-20 mr-2"
                />
                <Button onClick={() => handleUpdateStock(book.id, book.stock)}>
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
