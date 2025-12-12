import { PoolCart, User, Vendor } from './types';

// Hardcoded current user removed to support dynamic Auth

export const MOCK_CARTS: PoolCart[] = [
  {
    id: 'c1',
    host: {
      id: 'u2',
      name: 'Rahul K.',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+K&background=random',
      rating: 4.8,
      role: 'USER'
    },
    vendor: Vendor.INSTAMART,
    location: 'Hostel Block A',
    targetAmount: 200,
    currentAmount: 140,
    expiresAt: Date.now() + 1000 * 60 * 12, // 12 mins left
    items: [
        { id: 'i1', name: 'Milk 500ml', price: 28, userId: 'u2', userName: 'Rahul K.' },
        { id: 'i2', name: 'Bread', price: 40, userId: 'u3', userName: 'Sam' },
        { id: 'i3', name: 'Eggs (6)', price: 72, userId: 'u3', userName: 'Sam' }
    ],
    status: 'OPEN',
    isVeg: false,
    isMaxSaver: false
  },
  {
    id: 'c2',
    host: {
      id: 'u4',
      name: 'Priya S.',
      avatar: 'https://ui-avatars.com/api/?name=Priya+S&background=random',
      rating: 4.9,
      role: 'USER'
    },
    vendor: Vendor.ZEPTO,
    location: 'Girls Hostel 1',
    targetAmount: 250,
    currentAmount: 45,
    expiresAt: Date.now() + 1000 * 60 * 5, // 5 mins left
    items: [
        { id: 'i4', name: 'Chips', price: 45, userId: 'u4', userName: 'Priya S.' }
    ],
    status: 'OPEN',
    isVeg: true
  }
];