import { OrderList } from "@/app/components/OrderList";

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <OrderList />
    </div>
  );
}
