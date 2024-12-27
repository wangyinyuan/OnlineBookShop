"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import { BookCard } from "./BookCard";
import { getAllBooksPath, getAllBooksReq } from "@/apis/book";
import { motion, AnimatePresence } from "framer-motion";

export function BookList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useSWR(getAllBooksPath, () => getAllBooksReq());

  const filteredBooks = data?.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout>
        <AnimatePresence>
          {filteredBooks?.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                layout: { duration: 0.2 },
                opacity: { duration: 0.1 },
                scale: { duration: 0.1 },
              }}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
