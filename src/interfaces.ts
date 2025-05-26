export interface Product {
  uuid: string;
  name: string;
  brand: string;
  categories: string[];
  price: number;
  userId: string;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  categories: string[];
  price: number;
}