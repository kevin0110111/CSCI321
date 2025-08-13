// UserSubscription.jsx
import './userSubscription.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 确保导入axios
import { loadStripe } from '@stripe/stripe-js';

// 使用您的Stripe公钥
const stripePromise = loadStripe('pk_test_51Ru8SlHrem0LSH6PWcPPXY0sdWkVysPiYjWyh1UDqqecL7MH49Jv5bojWQ9zt7r5636oHpkWzih3JYxQjiS8JcrP004cD0orLg');

export default function UserSubscription() {
  const [isPremium, setIsPremium] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    document.title = 'Subscription Plan';
    
    // 获取订阅状态
    const fetchSubscriptionStatus = async () => {
      try {
        const accountId = localStorage.getItem('accountId');
        const response = await axios.get(
          `https://fyp-backend-a0i8.onrender.com/api/accounts/subscription-status?account_id=${accountId}`
        );
        
        setIsPremium(response.data.is_premium);
        if (response.data.subscription_expiry) {
          setExpiryDate(response.data.subscription_expiry);
          setDaysRemaining(response.data.days_remaining);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionStatus();
  }, []);

  // 支付模态框组件
  function PaymentModal({ onClose, onSuccess }) {
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState(''); // 添加姓名状态
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // 基本验证
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      
      setProcessing(true);
      
      try {
        const accountId = localStorage.getItem('accountId');
        
        // 调用后端API获取client_secret
        const response = await axios.post(
          `https://fyp-backend-a0i8.onrender.com/api/create-payment-intent?account_id=${accountId}`
        );
        
        const { clientSecret } = response.data;
        
        // 使用Stripe处理支付，使用用户输入的姓名
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: name } // 使用输入的姓名
          }
        });
        
        if (error) {
          setError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          onSuccess(); // 成功后调用
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
            {/* 添加姓名输入框 */}
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
      // 创建支付会话
      const response = await axios.post(
        `https://fyp-backend-a0i8.onrender.com/api/create-checkout-session?account_id=${accountId}`
      );
      
      const { sessionId } = response.data;
      
      // 重定向到Stripe Checkout
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
              <li><span style={{ color: 'green' }}>✓</span> Basic quota</li>
              <li><span style={{ color: 'red' }}>x</span> No re-detect</li>
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
              <li><span style={{ color: 'green' }}>✓</span> Re-detect</li>
              <li><span style={{ color: 'green' }}>✓</span> Export results</li>
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
        
        <p className="payment-note">Secure payment. Cancel anytime.</p>
      </div>

      {showModal && (
        <Elements stripe={stripePromise}>
          <PaymentModal 
            onClose={() => setShowModal(false)} 
            onSuccess={() => {
              // 显示成功消息
              alert("Payment successful! Your premium membership is now active.");
              
              // 更新状态
              setIsPremium(true);
              setShowModal(false);
              
              // 刷新整个页面以确保获取最新状态
              window.location.reload();
            }} 
          />
        </Elements>
      )}
    </main>
  );
}