"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/book";
import { Skeleton } from "@/components/ui/skeleton";
import { addCartsReq } from "@/apis/cart";
import { useToast } from "@/hooks/use-toast";

interface BookDetailProps {
  book: Book;
}

export function BookDetail({ book }: BookDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    await addCartsReq({ bookId: book.id, quantity });
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    });

    setIsAddingToCart(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <p className="text-xl mb-2">by {book.author}</p>
        <p className="text-2xl font-bold mb-4">${book.price.toFixed(2)}</p>
        <p className="mb-4">{book.description}</p>
        <p className="mb-4">In Stock: {book.stock}</p>
        <div className="flex items-center gap-4 mb-4">
          <Input
            type="number"
            min="1"
            max={book.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20"
          />
          <Button onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
      <div className="flex justify-center md:w-1/2 h-[40rem] overflow-hidden rounded-xl relative">
        {book.img ? (
          <>
            {imageLoading && <Skeleton className="w-full h-full absolute" />}
            <img
              className={`h-full object-contain rounded-2xl transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              src={book.img}
              alt={book.title}
              onLoad={() => setImageLoading(false)}
            />
          </>
        ) : (
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            No Book Cover Yet...
          </div>
        )}
      </div>
    </div>
  );
}
