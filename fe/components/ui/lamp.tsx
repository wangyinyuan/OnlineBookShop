"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-full flex-col items-center justify-center w-full rounded-md z-0 overflow-visible",
        className
      )}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            aspectRatio: "2/1",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[30rem] rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            aspectRatio: "2/1",
          }}
          className="absolute inset-auto left-1/2 h-56 overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-[30rem] rounded-full blur-3xl"
        />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
