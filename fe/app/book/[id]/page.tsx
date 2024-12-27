"use client";

import { notFound } from "next/navigation";
import { BookDetail } from "@/app/components/BookDetail";
import { Book } from "@/types/book";
import useSWR from "swr";
import { getAllBooksPath, getAllBooksReq } from "@/apis/book";
import { Loader } from "@/app/components/Loader";

// 模拟获取书籍详情的函数
function getBook(id: number, books?: Book[]) {
  // const mockBooks = [
  //   {
  //     id: 1,
  //     title: "The Great Gatsby",
  //     author: "F. Scott Fitzgerald",
  //     price: 9.99,
  //     stock: 50,
  //     description: "A classic novel about the American Dream.",
  //   },
  //   {
  //     id: 2,
  //     title: "To Kill a Mockingbird",
  //     author: "Harper Lee",
  //     price: 12.99,
  //     stock: 30,
  //     description:
  //       "A powerful story of racial injustice and loss of innocence.",
  //   },
  //   {
  //     id: 3,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  //   {
  //     id: 4,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  //   {
  //     id: 5,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  //   {
  //     id: 6,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  //   {
  //     id: 7,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  //   {
  //     id: 8,
  //     title: "1984",
  //     author: "George Orwell",
  //     price: 10.99,
  //     stock: 40,
  //     description: "A dystopian novel set in a totalitarian society.",
  //   },
  // ];
  if (!books) {
    return null;
  }

  const book = books.find((book) => book.id === id);

  if (!book) {
    return null;
  }
  return book;
}

interface BookPageProps {
  params: { id: string };
}

export default function BookPage({ params }: BookPageProps) {
  const { data, isLoading } = useSWR(getAllBooksPath, () => getAllBooksReq());

  if (isLoading) {
    return <Loader />;
  }

  const book = getBook(parseInt(params.id), data);

  if (!book) {
    notFound();
  }

  return <BookDetail book={book} />;
}
