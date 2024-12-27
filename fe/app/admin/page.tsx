"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { LampContainer } from "@/components/ui/lamp";
import {
  BookOpen,
  ShoppingCart,
  Users,
  ClipboardList,
  Truck,
} from "lucide-react";

const adminFeatures = [
  {
    title: "Inventory Management",
    icon: BookOpen,
    href: "/admin/inventory",
    description: "Manage book inventory and stock levels",
  },
  {
    title: "Purchase Management",
    icon: ShoppingCart,
    href: "/admin/purchases",
    description: "Handle purchase orders and supplier interactions",
  },
  {
    title: "Customer Management",
    icon: Users,
    href: "/admin/customers",
    description: "Manage customer accounts and credit levels",
  },
  {
    title: "Order Management",
    icon: ClipboardList,
    href: "/admin/orders",
    description: "Process and track customer orders",
  },
  {
    title: "Supplier Management",
    icon: Truck,
    href: "/admin/suppliers",
    description: "Manage supplier information and relationships",
  },
];

export default function AdminDashboard() {
  return (
    <LampContainer>
      <div className="px-6 py-12 md:px-12 text-gray-100 rounded-lg">
        <motion.h1
          className="text-5xl font-extrabold mb-8 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          Admin Dashboard
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Link href={feature.href}>
                <BackgroundGradient className="rounded-[22px] p-6 sm:p-10 bg-gray-800 h-full">
                  <div className="flex flex-col items-center text-center">
                    <feature.icon className="w-16 h-16 mb-6 text-blue-400" />
                    <h2 className="text-2xl font-bold mb-4 text-gray-100">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </BackgroundGradient>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </LampContainer>
  );
}
