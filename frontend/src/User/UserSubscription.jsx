// UserSubscription.jsx
import './userSubscription.css';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';  // Import Stripe
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';  // Stripe components

const stripePromise = loadStripe('pk_test_51Ru8SlHrem0LSH6PWcPPXY0sdWkVysPiYjWyh1UDqqecL7MH49Jv5bojWQ9zt7r5636oHpkWzih3JYxQjiS8JcrP004cD0orLg');  // Replace with your Publishable Key

export default function UserSubscription() {
  useEffect(() => {
    document.title = 'Subscription Plan';
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);  // Default to false
  const [loading, setLoading] = useState(true);  // Loading state while fetching
  const [currentAccountId, setCurrentAccountId] = useState(null);  // For API calls

  useEffect(() => {
    // Step 1: Get from localStorage (similar to UpdateAgentAccount.jsx)
    const storedAccountString = localStorage.getItem('account');
    const storedAccountId = localStorage.getItem('accountId');

    if (storedAccountId) {
      setCurrentAccountId(parseInt(storedAccountId, 10));
    }

    let storedIsPremium = false;
    if (storedAccountString) {
      try {
        const storedAccount = JSON.parse(storedAccountString);
        if (storedAccount && typeof storedAccount.is_premium === 'boolean') {
          storedIsPremium = storedAccount.is_premium;
        }
      } catch (error) {
        console.error('Failed to parse account from localStorage:', error);
      }
    }
    setIsPremium(storedIsPremium);  // Set initial value from localStorage

    if (!storedAccountString || !storedAccountId) {
      // Handle not logged in (e.g., show alert or redirect)
      alert('Please log in to view subscription.');
      setLoading(false);
      return;
    }

    const fetchSubscriptionStatus = async () => {
      try {
        // Step 2: Refresh from backend API to ensure up-to-date
        const token = localStorage.getItem('authToken');  // Use stored token for auth
        const response = await fetch(`https://fyp-backend-a0i8.onrender.com/accounts/subscription-status?account_id=${storedAccountId}`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setIsPremium(data.is_premium);

        // Optional: Update localStorage with latest status
        const storedAccount = JSON.parse(storedAccountString);
        storedAccount.is_premium = data.is_premium;
        localStorage.setItem('account', JSON.stringify(storedAccount));
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        // Optional: Set to false on error
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return <div>Loading subscription status...</div>;  // Show loader
  }

  return (
    <main className="dashboard-content">
      <div className="subscription-container">
        <h2>Choose Your Plan</h2>
        <div className="plan-options">
          <div className="plan-card">
            <h3>FREE</h3>
            <p className="price">$0<span>/month</span></p>
            <ul>
              <li>✓ Basic quota</li>
              <li>✓ No re-detect</li>
            </ul>
            <div className="button-group">
              {!isPremium && (
                <button className="current-plan" disabled>
                  Your Plan
                </button>
              )}
            </div>
          </div>

          <div className="plan-card premium">
            <h3>PREMIUM</h3>
            <p className="price">$20<span>/month</span></p>
            <ul>
              <li>✓ All features</li>
              <li>✓ Re-detect</li>
              <li>✓ Export results</li>
            </ul>
            <div className="button-group">
              {isPremium ? (
                <button className="current-plan" disabled>Your Plan</button>
              ) : (
                <button className="upgrade-btn" onClick={() => setShowModal(true)}>Upgrade</button>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <Elements stripe={stripePromise}>  {/* Wrap modal with Elements */}
            <PaymentModal onClose={() => setShowModal(false)} />
          </Elements>
        )}

        <p className="payment-note">Secure payment. Cancel at the end of the month.</p>
      </div>
    </main>
  );
}

// New component: Payment Modal
function PaymentModal({ onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    // Fetch client_secret from backend (payment intent)
    const response = await fetch('/create-payment-intent', {  // Replace with your backend API
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: 'Your Premium Price ID' }),  // Send price ID
    });
    const { clientSecret } = await response.json();

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: 'User Name' },  // Can be obtained from form
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Payment successful! Subscription activated.');
      onClose();
    }
    setProcessing(false);
  };

  return (
    <div className="payment-modal">
      <div className="payment-box">
        <h3>Pay for Premium</h3>
        <form onSubmit={handleSubmit}>
          <CardElement />  {/* Stripe card input element */}
          {error && <div>{error}</div>}
          <button className="confirm-btn" disabled={processing}>
            {processing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </form>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}