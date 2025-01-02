import { GetAllBooksResponse } from "@/types/api";
import { request } from "../index";
import { InventoryBook, PurchaseOrder } from "@/types/book";

export const getAllBooksPath = "/books/";
export const inventoryPath = "/books/inventory";
export const purchaseOrdersPath = "/books/purchase-orders";

export function getAllBooksReq() {
  return request<GetAllBooksResponse>({
    method: "GET",
    url: getAllBooksPath,
  });
}

export function getInventoryReq() {
  return request<InventoryBook[]>({
    method: "GET",
    url: inventoryPath,
  });
}

export function addInventoryReq(data: {
  title: string;
  author: string;
  isbn: string;
  stock: number;
}) {
  return request<void>({
    method: "POST",
    url: inventoryPath,
    data,
  });
}

export function updateInventoryReq(bookId: number, quantity: number) {
  return request<void>({
    method: "PUT",
    url: `${inventoryPath}/${bookId}`,
    data: { quantity },
  });
}

export function getPurchaseOrdersReq() {
  return request<PurchaseOrder[]>({
    method: "GET",
    url: purchaseOrdersPath,
  });
}

export function createPurchaseOrderReq(data: {
  supplier: string;
  book: string;
  quantity: number;
}) {
  return request<void>({
    method: "POST",
    url: purchaseOrdersPath,
    data,
  });
}

export function updatePurchaseOrderStatusReq(id: number, status: string) {
  return request<void>({
    method: "PUT",
    url: `${purchaseOrdersPath}/${id}`,
    data: { status },
  });
}
