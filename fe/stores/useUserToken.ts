import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserTokenState {
  token: string;
}

interface UserTokenAction {
  setToken: (token: string) => void;
}

export const useUserToken = create<UserTokenAction & UserTokenState>()(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
    }),
    {
      name: "user-token-storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);
