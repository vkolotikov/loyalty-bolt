import { Client, ScanData, VisitRecord } from '../types/client';

const API_DELAY = 800;

const mockClients: Record<string, Client> = {
  'CARD123': {
    id: 'client123',
    cardNumber: 'CARD123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@techcorp.com',
    phone: '+1234567890',
    gender: 'male',
    dateOfBirth: '1990-01-15',
    company: 'Tech Corp',
    cardType: 'points',
    points: 7, // Current points in cycle
    visitPoints: 67, // Total accumulated visit points
    bonusDiscount: 0,
    membership: 'Gold',
    lastVisit: new Date().toISOString(),
    visitHistory: [
      { id: 'v1', timestamp: '2024-01-01T10:00:00Z', pointsEarned: 1, totalPoints: 5 },
      { id: 'v2', timestamp: '2024-01-05T14:30:00Z', pointsEarned: 1, totalPoints: 6 },
      { id: 'v3', timestamp: '2024-01-10T16:45:00Z', pointsEarned: 1, totalPoints: 7 }
    ]
  },
  'DISC456': {
    id: 'client456',
    cardNumber: 'DISC456',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@designco.com',
    phone: '+1987654321',
    gender: 'female',
    dateOfBirth: '1992-03-20',
    company: 'Design Co',
    cardType: 'discount',
    discount: 15,
    bonusDiscount: 10,
    membership: 'Standard',
    lastVisit: new Date().toISOString(),
    visitHistory: []
  },
  'GIFT789': {
    id: 'client789',
    cardNumber: 'GIFT789',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@example.com',
    phone: '+1122334455',
    gender: 'female',
    dateOfBirth: '1988-07-12',
    company: 'Fashion Inc',
    cardType: 'gift',
    balance: 250,
    membership: 'Standard',
    lastVisit: new Date().toISOString(),
    visitHistory: []
  }
};

export const api = {
  async getClientByCardNumber(cardNumber: string): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found. Please check the card number and try again.');
    }
    return client;
  },

  async updatePoints(cardNumber: string, points: number): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found');
    }

    if (client.cardType !== 'points') {
      throw new Error('This operation is only available for points cards');
    }
    
    const updatedClient = {
      ...client,
      points: (client.points || 0) + points,
      visitPoints: (client.visitPoints || 0) + points,
      membership: (client.points || 0) + points >= 1000 ? 'Gold' : 'Standard'
    };
    
    mockClients[cardNumber] = updatedClient;
    return updatedClient;
  },

  async updateGiftCardBalance(cardNumber: string, amount: number): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found');
    }
    
    if (client.cardType !== 'gift') {
      throw new Error('This operation is only available for gift cards');
    }

    if ((client.balance || 0) + amount < 0) {
      throw new Error('Insufficient balance');
    }
    
    const updatedClient = {
      ...client,
      balance: (client.balance || 0) + amount
    };
    
    mockClients[cardNumber] = updatedClient;
    return updatedClient;
  },

  async useBonusDiscount(cardNumber: string): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found');
    }

    if (client.cardType !== 'points' && client.cardType !== 'discount') {
      throw new Error('Bonus discounts are only available for points and discount cards');
    }

    if (!client.bonusDiscount) {
      throw new Error('No bonus discount available');
    }

    const updatedClient = {
      ...client,
      bonusDiscount: undefined
    };

    mockClients[cardNumber] = updatedClient;
    return updatedClient;
  },

  async sendClientDetails(cardNumber: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found');
    }
    console.log(`Details sent to ${client.email}`);
  },

  async confirmVisit(cardNumber: string): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    const client = mockClients[cardNumber];
    if (!client) {
      throw new Error('Client not found');
    }

    const newVisit: VisitRecord = {
      id: `v${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    let updatedPoints = client.points || 0;
    let updatedVisitPoints = client.visitPoints || 0;
    
    // Only increment points for points card type
    if (client.cardType === 'points') {
      // Increment points, but only reset after reaching 11 visits (10 points)
      updatedPoints = updatedPoints >= 10 ? 0 : updatedPoints + 1;
      updatedVisitPoints += 1;
      
      newVisit.pointsEarned = 1;
      newVisit.totalPoints = updatedPoints;
    }

    const updatedVisitHistory = [...(client.visitHistory || []), newVisit];
    const isNthVisit = updatedVisitHistory.length % 10 === 0;

    const updatedClient = {
      ...client,
      lastVisit: new Date().toISOString(),
      visitHistory: updatedVisitHistory,
      // Update points only for points card type
      ...(client.cardType === 'points' && {
        points: updatedPoints,
        visitPoints: updatedVisitPoints
      }),
      // Add bonus discount on every 10th visit for points and discount cards
      bonusDiscount: (client.cardType === 'points' || client.cardType === 'discount') && isNthVisit ? 10 : client.bonusDiscount
    };

    mockClients[cardNumber] = updatedClient;
    return updatedClient;
  }
};