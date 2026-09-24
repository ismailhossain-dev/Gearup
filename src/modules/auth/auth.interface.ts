export interface IUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePhoto?: string;
}

export interface IUserLoginPayload  {
    email: string,
    password: string; 
}