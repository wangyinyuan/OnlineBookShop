import { OrderDetail } from "@/app/components/OrderDetail";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <OrderDetail orderId={params.id} />
    </div>
  );
}
