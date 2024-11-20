export type CardType = 'gift' | 'discount' | 'points';

export interface VisitRecord {
  id: string;
  timestamp: string;
  pointsEarned?: number;
  totalPoints?: number;
}

export interface Client {
  id: string;
  cardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  dateOfBirth: string;
  company: string;
  cardType: CardType;
  balance?: number; // For gift cards (in EUR)
  points?: number; // Current points in cycle (0-9)
  visitPoints?: number; // Total accumulated visit points
  discount?: number; // For discount cards
  bonusDiscount?: number; // For 10th visit reward
  membership: 'Standard' | 'Gold' | 'Platinum';
  lastVisit: string;
  visitHistory: VisitRecord[];
}

export interface ScanData {
  clientId: string;
  type: 'qr' | 'nfc' | 'manual';
  timestamp: string;
}