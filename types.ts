export enum Vendor {
  INSTAMART = 'Instamart',
  BLINKIT = 'Blinkit',
  ZEPTO = 'Zepto',
  DOMINOS = 'Dominos',
  SWIGGY = 'Swiggy'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 0-5 stars
  role: 'USER' | 'ADMIN';
  username?: string; // For login
  password?: string; // For login (mock)
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  userId: string;
  userName: string;
}

export interface PoolCart {
  id: string;
  host: User;
  vendor: Vendor;
  location: string; // e.g., "Hostel Block A"
  targetAmount: number; // Amount needed for free delivery
  currentAmount: number;
  expiresAt: number; // Timestamp
  items: CartItem[];
  status: 'OPEN' | 'LOCKED' | 'COMPLETED';
  isVeg?: boolean;
  isMaxSaver?: boolean;
}

export interface CartRequest {
  id: string;
  requester: User;
  vendor: Vendor;
  location: string;
  targetAmount: number;
  duration: number; // minutes
  timestamp: number;
  isVeg?: boolean;
  isMaxSaver?: boolean;
}

export interface ParsedItem {
  name: string;
  estimatedPrice: number;
}