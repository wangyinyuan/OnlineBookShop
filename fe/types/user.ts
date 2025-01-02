export interface UserInfo {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  creditLevel: number;
  accountBalance: number;
}
