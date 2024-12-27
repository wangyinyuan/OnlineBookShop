import { BookList } from "../components/BookList";

export default function Catalog() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>
      <BookList />
    </div>
  );
}
