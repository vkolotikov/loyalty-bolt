import React, { useState } from 'react';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import { adminApi } from '../../services/admin';
import type { ClientRegistration } from '../../types/admin';

const ClientRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; cardNumber: string } | null>(null);
  const [formData, setFormData] = useState<ClientRegistration>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'prefer-not-to-say',
    dateOfBirth: '',
    company: '',
    cardType: 'points',
    initialPoints: 0,
    initialBalance: 0,
    discount: 0,
    membership: 'Standard',
    cardNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newClient = await adminApi.registerClient(formData);
      setSuccess({
        message: 'Client registered successfully!',
        cardNumber: newClient.cardNumber
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: 'prefer-not-to-say',
        dateOfBirth: '',
        company: '',
        cardType: 'points',
        initialPoints: 0,
        initialBalance: 0,
        discount: 0,
        membership: 'Standard',
        cardNumber: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['initialPoints', 'initialBalance', 'discount'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-primary mb-6">Register New Client</h2>

      {success && (
        <div className="mb-6">
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <IdentificationIcon className="h-8 w-8 text-secondary mr-3" />
              <h3 className="text-lg font-medium text-neutral">Registration Successful</h3>
            </div>
            <p className="text-neutral/80 mb-4">{success.message}</p>
            <div className="bg-white rounded-md p-4 border border-secondary/20">
              <p className="text-sm text-neutral/60 mb-1">Client Card Number:</p>
              <p className="text-2xl font-mono font-bold text-secondary">{success.cardNumber}</p>
            </div>
            <p className="mt-4 text-sm text-neutral/60">
              Make sure to provide this card number to the client. They will need it to access their account.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardType" className="block text-sm font-medium text-neutral">
            Card Type
          </label>
          <select
            id="cardType"
            name="cardType"
            value={formData.cardType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="points">Points Card</option>
            <option value="discount">Discount Card</option>
            <option value="gift">Gift Card</option>
          </select>
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="Enter card number (optional)"
            className="input-field"
          />
          <p className="mt-1 text-sm text-neutral/60">
            Optional - Leave empty to auto-generate a card number
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-neutral">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-neutral">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.cardType === 'gift' ? (
            <div className="md:col-span-3">
              <label htmlFor="initialBalance" className="block text-sm font-medium text-neutral">
                Initial Balance (EUR)
              </label>
              <input
                type="number"
                id="initialBalance"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input-field"
              />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="initialPoints" className="block text-sm font-medium text-neutral">
                  Initial Points
                </label>
                <input
                  type="number"
                  id="initialPoints"
                  name="initialPoints"
                  value={formData.initialPoints}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-neutral">
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="membership" className="block text-sm font-medium text-neutral">
                  Membership
                </label>
                <select
                  id="membership"
                  name="membership"
                  value={formData.membership}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Standard">Standard</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register Client'}
        </button>
      </form>
    </div>
  );
};

export default ClientRegistrationForm;