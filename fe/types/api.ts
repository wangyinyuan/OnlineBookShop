import { Book } from "./book";
import { UserInfo } from "./user";

export interface LoginParams {
  email: string;
  password: string;
}

export type LoginResponse = UserInfo & {
  token: string;
};

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = LoginResponse;

export type GetAllBooksResponse = Array<Book>;

export type AddCartsParams = {
  bookId: number;
  quantity: number;
};
