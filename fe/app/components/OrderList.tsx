"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/app/components/Loader";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import { getOrdersPath, getOrdersReq } from "@/apis/order";

export function OrderList() {
  const { data, isLoading } = useSWR(getOrdersPath, () => getOrdersReq());
  const { toast } = useToast();

  if (isLoading) {
    return <Loader />;
  }

  const orders = data || [];

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => (
            <TableRow key={order.order_id}>
              <TableCell>{order.order_id}</TableCell>
              <TableCell>
                {new Date(order.order_date).toLocaleDateString()}
              </TableCell>
              <TableCell>${parseFloat(order.total).toFixed(2)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Link href={`/orders/${order.order_id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
