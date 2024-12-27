"use client";

import { useState } from "react";
import Link from "next/link";
import { Book } from "@/types/book";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addCartsReq } from "@/apis/cart";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addCartsReq({ bookId: book.id, quantity: 1 });
    setIsAddingToCart(false);
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Author: {book.author}</p>
        <p>Price: ${book.price.toFixed(2)}</p>
        <p>In Stock: {book.stock}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/book/${book.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Button onClick={handleAddToCart} disabled={isAddingToCart}>
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
