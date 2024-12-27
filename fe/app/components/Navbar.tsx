"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/stores/useUserInfo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/account", label: "Account" },
  { href: "/login", label: "Login" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = useUserInfo((state) => state.isAdmin);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Online Bookstore
          </Link>
          <div className="flex space-x-4">
            {navItems.map(
              (item) =>
                (!item.adminOnly || isAdmin) && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}>
                    {item.label}
                  </Link>
                )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
