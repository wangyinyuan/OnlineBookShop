import { request } from "@/apis";
import { LoginParams, LoginResponse } from "@/types/api";

export const loginPath = "/customers/login";

export const loginReq = ({ email, password }: LoginParams) => {
  return request<LoginResponse>({
    method: "POST",
    url: loginPath,
    data: { email, password },
  });
};
