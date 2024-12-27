import { CartContent } from "../components/CartContent";

export default function CartPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <CartContent />
    </div>
  );
}
