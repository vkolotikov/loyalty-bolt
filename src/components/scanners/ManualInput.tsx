import React, { useState, useEffect } from 'react';
import { useScanner } from '../../hooks/useScanner';
import { useClient } from '../../context/ClientContext';

const VALID_CARD_PREFIXES = ['CARD', 'GIFT', 'DISC'];

const ManualInput: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError, handleScan } = useScanner({ type: 'manual' });
  const { client } = useClient();

  useEffect(() => {
    if (client) {
      setCardNumber('');
      setIsSubmitting(false);
    }
  }, [client]);

  const validateCardNumber = (number: string) => {
    if (!number) return 'Please enter a card number';
    if (number.length < 6) return 'Card number must be at least 6 characters';
    
    const prefix = VALID_CARD_PREFIXES.find(p => number.toUpperCase().startsWith(p));
    if (!prefix) {
      return `Card number must start with ${VALID_CARD_PREFIXES.join(', ')}`;
    }
    
    if (!/^[A-Z0-9-]+$/i.test(number)) {
      return 'Card number can only contain letters, numbers, and hyphens';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedCardNumber = cardNumber.trim().toUpperCase();
    const validationError = validateCardNumber(trimmedCardNumber);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await handleScan(trimmedCardNumber);
    } catch (err) {
      // Error is already handled by useScanner
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(value);
    if (error) setError(null);
  };

  if (client) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-primary">Manual Card Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral">
            Card Number
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Enter card number (e.g., CARD123)"
              className={`input-field ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'card-number-error' : undefined}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" id="card-number-error">
              {error}
            </p>
          )}
          <p className="mt-2 text-sm text-neutral/60">
            Valid card numbers start with: {VALID_CARD_PREFIXES.join(', ')}
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default ManualInput;