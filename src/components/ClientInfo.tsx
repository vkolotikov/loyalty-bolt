import React, { useState } from 'react';
import { useClient } from '../context/ClientContext';

const ClientInfo: React.FC = () => {
  const { client, loading, error, updatePoints, updateBalance, useBonusDiscount, confirmVisit } = useClient();
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [amountToRedeem, setAmountToRedeem] = useState('');
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleAmountSubmit = async () => {
    if (!client) return;

    const amount = parseInt(amountToRedeem);

    if (isNaN(amount) || amount <= 0) {
      setRedeemError('Please enter a valid number of points');
      return;
    }

    if (amount > (client.points || 0)) {
      setRedeemError('Not enough points available');
      return;
    }

    setRedeeming(true);
    setRedeemError(null);
    
    try {
      await updatePoints(-amount);
      setShowAmountInput(false);
      setAmountToRedeem('');
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : 'Failed to redeem');
    } finally {
      setRedeeming(false);
    }
  };

  const handleConfirmVisit = async () => {
    setConfirming(true);
    try {
      await confirmVisit();
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
    } finally {
      setConfirming(false);
    }
  };

  const handleUseBonusDiscount = async () => {
    try {
      await useBonusDiscount();
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : 'Failed to use bonus discount');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-secondary rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-secondary rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-4 h-4 bg-secondary rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">Error</p>
          <p className="text-neutral/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-neutral/60">Scan a QR code or NFC tag to view client information</p>
          <p className="text-sm text-neutral/40 mt-2">Make sure the code/tag is clearly visible</p>
        </div>
      </div>
    );
  }

  if (client.cardType === 'discount') {
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-neutral">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-2xl text-neutral/60 mt-3">{client.company}</p>
          </div>

          <div>
            <p className="text-xl text-neutral/60">Card Number</p>
            <p className="text-3xl font-mono font-bold text-secondary mt-2">{client.cardNumber}</p>
          </div>

          <div>
            <p className="text-xl text-neutral/60">Regular Discount</p>
            <p className="text-6xl font-bold text-primary mt-2">{client.discount}%</p>
          </div>

          {client.bonusDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium text-lg">
                {client.bonusDiscount}% bonus discount available!
              </p>
              <button
                onClick={handleUseBonusDiscount}
                className="mt-3 btn-success w-full"
              >
                Use Bonus Discount
              </button>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleConfirmVisit}
              disabled={confirming || confirmed}
              className={`w-full ${
                confirmed
                  ? 'btn-success'
                  : confirming
                  ? 'btn-primary opacity-50 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {confirmed ? '✓ Visit Confirmed' : confirming ? 'Confirming...' : 'Confirm Visit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (client.cardType === 'points') {
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-xl text-neutral/60 mt-2">{client.company}</p>
          </div>

          <div>
            <p className="text-lg text-neutral/60">Card Number</p>
            <p className="text-2xl font-mono font-bold text-secondary">{client.cardNumber}</p>
          </div>

          <div>
            <p className="text-lg text-neutral/60">Points</p>
            <p className="text-4xl font-bold text-primary">{client.points} / 10</p>
            <p className="text-sm text-neutral/60 mt-1">Total visits: {client.visitPoints}</p>
          </div>

          {client.bonusDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 font-medium">
                {client.bonusDiscount}% bonus discount available!
              </p>
              <button
                onClick={handleUseBonusDiscount}
                className="mt-2 btn-success text-sm w-full"
              >
                Use Bonus Discount
              </button>
            </div>
          )}

          <div className="pt-4 space-y-2">
            {!showAmountInput ? (
              <button
                onClick={() => setShowAmountInput(true)}
                className="w-full btn-secondary"
              >
                Redeem Points
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amountToRedeem}
                    onChange={(e) => {
                      setAmountToRedeem(e.target.value);
                      setRedeemError(null);
                    }}
                    placeholder="Enter points to redeem"
                    className="input-field"
                    disabled={redeeming}
                    min="1"
                    max={client.points || 0}
                  />
                  <button
                    onClick={handleAmountSubmit}
                    disabled={redeeming}
                    className="btn-secondary"
                  >
                    {redeeming ? 'Processing...' : 'Redeem'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowAmountInput(false);
                    setAmountToRedeem('');
                    setRedeemError(null);
                  }}
                  disabled={redeeming}
                  className="w-full btn-neutral"
                >
                  Cancel
                </button>
                {redeemError && (
                  <p className="text-red-600 text-sm">{redeemError}</p>
                )}
              </div>
            )}
            <button
              onClick={handleConfirmVisit}
              disabled={confirming || confirmed}
              className={`w-full ${
                confirmed
                  ? 'btn-success'
                  : confirming
                  ? 'btn-primary opacity-50 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {confirmed ? '✓ Visit Confirmed' : confirming ? 'Confirming...' : 'Confirm Visit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (client.cardType === 'gift') {
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-neutral">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-2xl text-neutral/60 mt-3">{client.company}</p>
          </div>

          <div>
            <p className="text-xl text-neutral/60">Card Number</p>
            <p className="text-3xl font-mono font-bold text-secondary mt-2">{client.cardNumber}</p>
          </div>

          <div>
            <p className="text-xl text-neutral/60">Balance</p>
            <p className="text-6xl font-bold text-primary mt-2">€{client.balance?.toFixed(2)}</p>
          </div>

          <div className="pt-4 space-y-2">
            {!showAmountInput ? (
              <button
                onClick={() => setShowAmountInput(true)}
                className="w-full btn-secondary"
              >
                Use Balance
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={amountToRedeem}
                    onChange={(e) => {
                      setAmountToRedeem(e.target.value);
                      setRedeemError(null);
                    }}
                    placeholder="Enter amount in EUR"
                    className="input-field"
                    disabled={redeeming}
                  />
                  <button
                    onClick={handleAmountSubmit}
                    disabled={redeeming}
                    className="btn-secondary"
                  >
                    {redeeming ? 'Processing...' : 'Use'}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowAmountInput(false);
                    setAmountToRedeem('');
                    setRedeemError(null);
                  }}
                  disabled={redeeming}
                  className="w-full btn-neutral"
                >
                  Cancel
                </button>
                {redeemError && (
                  <p className="text-red-600 text-sm">{redeemError}</p>
                )}
              </div>
            )}
            <button
              onClick={handleConfirmVisit}
              disabled={confirming || confirmed}
              className={`w-full ${
                confirmed
                  ? 'btn-success'
                  : confirming
                  ? 'btn-primary opacity-50 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {confirmed ? '✓ Visit Confirmed' : confirming ? 'Confirming...' : 'Confirm Visit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ClientInfo;