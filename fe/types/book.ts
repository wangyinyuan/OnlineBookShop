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
