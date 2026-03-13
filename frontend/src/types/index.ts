export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Medicine {
  _id: string;
  name: string;
  category: string | Category;
  composition: string;
  manufacturer: string;
  price: number;
  discountPrice?: number;
  stock: number;
  expiryDate: string;
  batchNumber: string;
  description: string;
  prescriptionRequired: boolean;
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface CartItem {
  _id: string;
  medicine: Medicine;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'store' | 'online';
  orderStatus: 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryType: 'home' | 'pickup';
  deliveryAddress?: Address;
  prescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  medicine: Medicine;
  quantity: number;
  price: number;
}

export interface Prescription {
  _id: string;
  user: User;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
