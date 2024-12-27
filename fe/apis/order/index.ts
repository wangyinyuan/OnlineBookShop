import { request } from "../index";

export const getOrdersPath = "/orders";
export const createOrderPath = "/orders";
export const getOrderDetailsPath = (orderId: number) => `/orders/${orderId}`;

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
