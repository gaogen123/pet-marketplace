export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[]; // 商品多图
  description: string;
  rating: number;
  sales: number;
  stock?: number;
  specs?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: { [key: string]: string };
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'sales' | 'rating';

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  totalAmount: number;
  createTime: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  register_time: string;
}