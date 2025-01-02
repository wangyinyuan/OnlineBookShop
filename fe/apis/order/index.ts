import { request } from "../index";
import { Order } from "@/types/order";

export const getOrdersPath = "/orders";
export const createOrderPath = "/orders";
export const getOrderDetailsPath = (orderId: number) => `/orders/${orderId}`;
export const getAllOrdersPath = "/orders/all";

export const getOrdersReq = () => {
  return request({
    url: getOrdersPath,
    method: "GET",
  });
};

export const createOrderReq = () => {
  return request({
    url: createOrderPath,
    method: "POST",
  });
};

export const getOrderDetailsReq = (orderId: number) => {
  return request({
    url: getOrderDetailsPath(orderId),
    method: "GET",
  });
};

export function getAllOrdersReq() {
  return request<Order[]>({
    method: "GET",
    url: getAllOrdersPath,
  });
}

export function updateOrderStatusReq(orderId: number, status: string) {
  return request<void>({
    method: "PUT",
    url: `/orders/${orderId}/status`,
    data: { status },
  });
}
