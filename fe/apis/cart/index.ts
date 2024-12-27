import { AddCartsParams } from "./../../types/api";
import { request } from "../index";

export const getCartsPath = "/carts/";
export const addCartsPath = "/carts/add";
export const deleteCartPath = (cartId: number) => `/carts/${cartId}`;
export const updateCartPath = (cartId: number) => `/carts/${cartId}`;

export const getCartsReq = () => {
  return request({
    url: getCartsPath,
    method: "GET",
  });
};

export const addCartsReq = ({ bookId, quantity }: AddCartsParams) => {
  return request({
    url: addCartsPath,
    method: "POST",
    data: {
      bookId,
      quantity,
    },
  });
};

export const deleteCartReq = (cartId: number) => {
  return request({
    url: deleteCartPath(cartId),
    method: "DELETE",
  });
};

export const updateCartReq = (cartId: number, quantity: number) => {
  return request({
    url: updateCartPath(cartId),
    method: "PUT",
    data: { quantity },
  });
};
