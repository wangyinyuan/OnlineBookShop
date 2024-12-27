import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secrets";
import { TOKEN_EXPIRE_TIME } from "../config/api";

export function getResResult(code: number, message = "", data: any = null) {
  return {
    code,
    message,
    data,
  };
}

interface TokenPayload {
  id: number;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRE_TIME });
};
