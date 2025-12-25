import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}
