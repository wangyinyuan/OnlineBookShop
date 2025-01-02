import { request } from "@/apis/index";
import { Supplier } from "@/types/supplier";

export const suppliersPath = "/suppliers";

export function getSuppliersReq() {
  return request<Supplier[]>({
    method: "GET",
    url: suppliersPath,
  });
}

export function addSupplierReq(data: { name: string; contactInfo: string }) {
  return request<Supplier>({
    method: "POST",
    url: suppliersPath,
    data,
  });
}

export function updateSupplierReq(
  id: number,
  data: {
    name: string;
    contactInfo: string;
  }
) {
  return request<void>({
    method: "PUT",
    url: `${suppliersPath}/${id}`,
    data,
  });
}
