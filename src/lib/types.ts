export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  colors: [string, string];
  description: string;
  features: string[];
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
}
