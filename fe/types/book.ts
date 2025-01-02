export interface Book {
  id: number;
  isbn: string;
  title: string;
  publisher: string;
  price: number;
  content?: string;
  img?: string;
  seriesId?: number;
  description: string;
  author: string;
  keywords: string;
  suppliers: string;
  stock: number;
}

export type InventoryBook = Pick<
  Book,
  "id" | "title" | "author" | "isbn" | "stock"
>;

export interface PurchaseOrder {
  id: number;
  supplier: string;
  book: string;
  quantity: number;
  status: string;
  orderDate: string;
  price: number;
}
