// UserSubscription.jsx
import './userSubscription.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Ru8SlHrem0LSH6PWcPPXY0sdWkVysPiYjWyh1UDqqecL7MH49Jv5bojWQ9zt7r5636oHpkWzih3JYxQjiS8JcrP004cD0orLg');

export default function UserSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    document.title = 'Subscription Plan';
    

    fetchSubscriptionStatus();
  }, []);


  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const accountId = localStorage.getItem('accountId');
      
      const response = await axios.get(
        `https://fyp-backend-a0i8.onrender.com/api/accounts/subscription-status?account_id=${accountId}`
      );
      
      const newIsPremium = response.data.is_premium;
      

      localStorage.setItem('premiumStatus', newIsPremium);
      

      setIsPremium(newIsPremium);
      if (response.data.subscription_expiry) {
        setExpiryDate(response.data.subscription_expiry);
        setDaysRemaining(response.data.days_remaining);
      }
    } catch (error) {
      console.error('Load premiun status failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // payment modal component
  function PaymentModal({ onClose, onSuccess }) {
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState(''); 
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // authenticate user input
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      
      setProcessing(true);
      
      try {
        const accountId = localStorage.getItem('accountId');
        
        // invoke Stripe API to create payment intent
        const response = await axios.post(
          `https://fyp-backend-a0i8.onrender.com/api/create-payment-intent?account_id=${accountId}`
        );
        
        const { clientSecret } = response.data;
        
        // use Stripe.js to confirm the payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: name } 
          }
        });
        
        if (error) {
          setError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          onSuccess(); 
        }
      } catch (err) {
        setError('Payment failed. Please try again.');
        console.error(err);
      } finally {
        setProcessing(false);
      }
    };
    
    return (
      <div className="payment-modal">
        <div className="payment-content">
          <h2>Complete Your Purchase</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="name-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="card">Card Details</label>
              <CardElement 
                id="card"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  }
                }}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={processing || !stripe}>
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
          <button className="close-modal" onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  const handleUpgradeClick = async () => {
    const accountId = localStorage.getItem('accountId');
    
    try {
      //create a Stripe Checkout session
      const response = await axios.post(
        `https://fyp-backend-a0i8.onrender.com/api/create-checkout-session?account_id=${accountId}`
      );
      
      const { sessionId } = response.data;
      
      // redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
    }
  };

  return (
    <main className="dashboard-content">
      <div className="subscription-container">
        <h2>Choose Your Plan</h2>
        <div className="plan-options">
          <div className="plan-card">
            <h3>FREE</h3>
            <p className="price">$0<span>/month</span></p>
            <ul>
              <li><span style={{ color: 'green' }}>✓</span> Basic Count</li>
              <li><span style={{ color: 'red' }}>x</span> ZIP Upload</li>
              <li><span style={{ color: 'red' }}>x</span> Multiple images Upload</li>
            </ul>
            <div className="button-group">
              {!isPremium && (
                <button className="current-plan" disabled>
                  Current Plan
                </button>
              )}
            </div>
          </div>

          <div className="plan-card premium">
            <h3>PREMIUM</h3>
            <p className="price">$20<span>/month</span></p>
            {isPremium && daysRemaining && (
              <div className="subscription-status">
                <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  {daysRemaining} days remaining
                </p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>
                  Expires: {new Date(expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}
            <ul>
              <li><span style={{ color: 'green' }}>✓</span> All features</li>
              <li><span style={{ color: 'green' }}>✓</span> Disease detection</li>
            </ul>
            <div className="button-group">
              {isPremium ? (
                <button className="current-plan" disabled>Current Plan</button>
              ) : (
                <button className="upgrade-btn" onClick={handleUpgradeClick}>Upgrade</button>
              )}
            </div>
          </div>
        </div>
        
        <p className="payment-note">Secure payment. Cancel at the end of the month.</p>
      </div>

      {showModal && (
        <Elements stripe={stripePromise}>
          <PaymentModal 
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
            
              alert("Payment successful! Your premium membership is now active.");
              
              
              setIsPremium(true);
              setShowModal(false);
              
              
              window.location.reload();
            }} 
          />
        </Elements>
      )}
    </main>
  );
}