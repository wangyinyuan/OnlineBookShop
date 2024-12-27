"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";

const welcomeWords = [
  {
    text: "Welcome",
    className: "text-blue-500 dark:text-blue-500",
  },
  {
    text: "to",
  },
  {
    text: "Our",
  },
  {
    text: "Online",
  },
  {
    text: "Bookstore!",
    className: "text-green-500 dark:text-green-500",
  },
];

export default function Home() {
  return (
    <BackgroundLines className="flex flex-col items-center justify-center min-h-full py-2 space-y-8">
      <TypewriterEffect words={welcomeWords} />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl mb-8">
        Discover your next favorite book today
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Link href="/catalog">
          <Button size="lg">Browse Catalog</Button>
        </Link>
      </motion.div>
    </BackgroundLines>
  );
}
