"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseEntered, setMouseEntered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !animate) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseEntered) return;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;
      container.style.setProperty("--x", x.toString());
      container.style.setProperty("--y", y.toString());
    };

    const handleMouseEnter = () => {
      setMouseEntered(true);
    };

    const handleMouseLeave = () => {
      setMouseEntered(false);
      container.style.setProperty("--x", "0.5");
      container.style.setProperty("--y", "0.5");
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseEntered, animate]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[22px] p-[--padding] transition-all duration-300 [--radius:theme(borderRadius.lg)] [--padding:theme(spacing.2)]",
        containerClassName
      )}>
      <div
        className="pointer-events-none absolute inset-0 transition duration-300 [--gradient-visible:1]"
        style={{
          background:
            "radial-gradient(circle at calc(var(--x) * 100%) calc(var(--y) * 100%), rgba(120, 119, 198, 0.3) 0%, rgba(255, 0, 199, 0.3) 25%, transparent 50%)",
          opacity: "var(--gradient-visible)",
        }}></div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
