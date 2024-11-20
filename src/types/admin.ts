export interface Admin {
  id: string;
  username: string;
  role: 'admin';
}

export interface AdminStats {
  totalClients: number;
  activeClients: number;
  monthlyRegistrations: number[];
  monthlyActiveUsers: number[];
}

export interface ClientRegistration {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  dateOfBirth: string;
  company: string;
  cardType: 'gift' | 'discount' | 'points';
  initialPoints?: number;
  initialBalance?: number;
  discount?: number;
  bonusDiscount?: number;
  membership?: 'Standard' | 'Gold' | 'Platinum';
  cardNumber?: string;
}