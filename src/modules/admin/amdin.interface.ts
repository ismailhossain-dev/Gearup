export interface IUpdateUser {
  role?: "ADMIN" | "PROVIDER" | "CUSTOMER";
  status?: "ACTIVE" | "SUSPENDED";
}