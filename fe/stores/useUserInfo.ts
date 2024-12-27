import { UserInfo } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserInfoState = UserInfo;

interface UserInfoAction {
  setUserInfo: (userInfo: Partial<UserInfoState> | null) => void;
}

const initialState: UserInfoState = {
  email: "",
  name: "",
  isAdmin: false,
};

export const useUserInfo = create<UserInfoState & UserInfoAction>()(
  persist(
    (set) => ({
      ...initialState,
      setUserInfo: (userInfo) =>
        set((state) => ({
          ...state,
          ...(userInfo === null ? initialState : userInfo),
        })),
    }),
    {
      name: "user-info-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
