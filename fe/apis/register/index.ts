import { request } from "@/apis";
import { RegisterParams, RegisterResponse } from "@/types/api";

export const registerPath = "/customers/register";

export const registerReq = ({ name, email, password }: RegisterParams) => {
  return request<RegisterResponse>({
    method: "POST",
    url: registerPath,
    data: { name, email, password },
  });
};
