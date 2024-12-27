import axios, { AxiosRequestConfig } from "axios";
import { useUserToken } from "@/stores/useUserToken";
import { toastUtil } from "@/utils/toast";

const BASE_URL = "http://localhost:8080/api";

const httpInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

httpInstance.interceptors.request.use(
  (config) => {
    const token = useUserToken.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    toastUtil.show("Network Error", "Please try again later", "destructive");
    return Promise.reject(error);
  }
);

httpInstance.interceptors.response.use(
  (response) => {
    return response.data.data;
  },
  (error) => {
    if (!error.response) {
      toastUtil.show("Network Error", "Please try again later", "destructive");
      console.error("没有收到响应");
    } else {
      switch (error.response.status) {
        case 401:
          toastUtil.show("Please log in again", "", "destructive");
          window.location.replace(`/login`);
          break;
        default:
          toastUtil.show(
            "Error",
            error.response.data?.message || error.response.message,
            "destructive"
          );
      }
    }

    return Promise.reject(error);
  }
);

export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return httpInstance(config) as Promise<T>;
}
