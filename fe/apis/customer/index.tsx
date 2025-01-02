import { request } from "@/apis/index";
import { Customer } from "@/types/user";

export const customersPath = "/customers";

export function getCustomersReq() {
  return request<Customer[]>({
    method: "GET",
    url: customersPath,
  });
}

export function updateCustomerReq(
  id: number,
  data: {
    creditLevel: number;
    accountBalance: number;
  }
) {
  return request<void>({
    method: "PUT",
    url: `${customersPath}/${id}`,
    data,
  });
}
