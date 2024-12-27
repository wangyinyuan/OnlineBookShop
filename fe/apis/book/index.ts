import { GetAllBooksResponse } from "@/types/api";
import { request } from "../index";

export const getAllBooksPath = "/books/";

export function getAllBooksReq() {
  return request<GetAllBooksResponse>({
    method: "GET",
    url: getAllBooksPath,
  });
}
