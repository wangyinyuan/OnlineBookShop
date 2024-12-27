"use client";

import IconCloud from "@/components/ui/icon-cloud";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "html5",
  "css3",
  "bun",
  "express",
  "nextdotjs",
  "mysql",
  "vercel",
  "framer",
  "tailwindcss",
  "shadcn",
  "axios",
  "swr",
  "zustand",
];

export function StackCloud() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}
