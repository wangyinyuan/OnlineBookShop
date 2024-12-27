"use client";

import { useUserInfo } from "@/stores/useUserInfo";
import { usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = useUserInfo((state) => state.isAdmin);
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdmin && pathname.startsWith("/admin")) {
      notFound();
    }
  }, [isAdmin, pathname]);

  if (!isAdmin && pathname.startsWith("/admin")) {
    notFound();
  }

  return <>{children}</>;
}
