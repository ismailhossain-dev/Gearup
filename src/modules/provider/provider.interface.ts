export interface IUpdateGear {
  name?: string;
  description?: string;
  pricePerDay?: number;
  stock?: number;
  availableStock?: number;
  brand?: string;
  image?: string;
  categoryId: string;
}
