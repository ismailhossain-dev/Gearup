export interface ICreateGear {
  name: string;
  description: string;
  brand?: string;
  image: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
  isAvailable: number;
  availableStock: number;
}

export interface IGearQuery {
  searchTerm?: string;
  category?: string;
  price?: number;
  brand?: string;
}