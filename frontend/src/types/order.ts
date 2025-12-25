import { Product } from './product';
import { Address } from './user';

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: StatusHistory[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface CreateOrderData {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
}
