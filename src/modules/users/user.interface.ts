import { Role } from "../../../generated/prisma/enums";

export interface IUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePhoto?: string;
}
