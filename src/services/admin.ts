import { Admin, AdminStats, ClientRegistration } from '../types/admin';
import { Client } from '../types/client';

const MOCK_ADMIN: Admin = {
  id: 'admin1',
  username: 'admin',
  role: 'admin'
};

const MOCK_STATS: AdminStats = {
  totalClients: 150,
  activeClients: 89,
  totalPoints: 45600,
  averagePoints: 304
};

let MOCK_CLIENTS: Client[] = [
  {
    id: 'client123',
    cardNumber: 'CARD123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    company: 'Tech Corp',
    cardType: 'discount',
    points: 1500,
    discount: 10,
    membership: 'Gold',
    lastVisit: new Date().toISOString()
  },
  {
    id: 'client124',
    cardNumber: 'GIFT456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    gender: 'female',
    dateOfBirth: '1992-05-15',
    company: 'Design Co',
    cardType: 'gift',
    balance: 250,
    discount: 0,
    membership: 'Standard',
    lastVisit: new Date().toISOString()
  }
];

const generateCardNumber = (): string => {
  const prefix = 'CARD';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${randomNum}`;
};

export const adminApi = {
  async login(username: string, password: string): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (username === 'admin' && password === 'admin123') {
      return MOCK_ADMIN;
    }
    throw new Error('Invalid credentials');
  },

  async getStats(): Promise<AdminStats> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Calculate stats only for discount cards
    const discountCards = MOCK_CLIENTS.filter(client => client.cardType === 'discount');
    const totalPoints = discountCards.reduce((sum, client) => sum + (client.points || 0), 0);
    
    return {
      totalClients: MOCK_CLIENTS.length,
      activeClients: discountCards.length,
      totalPoints,
      averagePoints: discountCards.length > 0 ? Math.round(totalPoints / discountCards.length) : 0
    };
  },

  async getClients(): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_CLIENTS;
  },

  async registerClient(data: ClientRegistration): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (data.cardNumber) {
      const exists = MOCK_CLIENTS.some(client => client.cardNumber === data.cardNumber);
      if (exists) {
        throw new Error('Card number already in use');
      }
    }

    const newClient: Client = {
      id: `client${Date.now()}`,
      cardNumber: data.cardNumber || generateCardNumber(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      company: data.company,
      cardType: data.cardType,
      ...(data.cardType === 'gift' 
        ? { 
            balance: data.initialBalance || 0,
            points: undefined,
            discount: 0,
            membership: 'Standard'
          }
        : {
            points: data.initialPoints || 0,
            balance: undefined,
            discount: data.discount || 0,
            membership: data.membership || 'Standard'
          }
      ),
      lastVisit: new Date().toISOString()
    };
    
    MOCK_CLIENTS.push(newClient);
    return newClient;
  },

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_CLIENTS.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    
    const currentClient = MOCK_CLIENTS[index];
    const updatedClient = {
      ...currentClient,
      ...data,
      // Preserve card type specific fields
      ...(currentClient.cardType === 'gift'
        ? {
            balance: data.balance ?? currentClient.balance,
            points: undefined,
            discount: 0,
            membership: 'Standard'
          }
        : {
            points: data.points ?? currentClient.points,
            balance: undefined,
            discount: data.discount ?? currentClient.discount,
            membership: data.membership ?? currentClient.membership
          }
      ),
      lastVisit: currentClient.lastVisit // Preserve original last visit
    };
    
    MOCK_CLIENTS[index] = updatedClient;
    return updatedClient;
  },

  async deleteClient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_CLIENTS.findIndex(client => client.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    MOCK_CLIENTS = MOCK_CLIENTS.filter(client => client.id !== id);
  }
};