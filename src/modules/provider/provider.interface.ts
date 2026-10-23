export interface ICreateGear {
  name: string;
  description: string;
  pricePerDay: number;
  stock: number;
  availableStock: number;
  brand?: string;
  image?: string;
  //userId
  providerId: string;
}

export interface IUpdateGear {
  name?: string;
  description?: string;
  pricePerDay?: number;
  stock?: number;
  availableStock?: number;
  brand?: string;
  image?: string;
}
