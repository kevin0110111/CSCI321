// UserSubscription.jsx
import './userSubscription.css';
import React, { useState, useEffect, useRef } from 'react';

export default function UserSubscription() {

useEffect(() => {
      document.title = 'Subscription Plan';
    }, []);

const [showModal, setShowModal] = useState(false);

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
                  <button className="current-plan" disabled>Your Plan</button>
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
              <button className="upgrade-btn" onClick={() => setShowModal(true)}>Upgrade</button>
            </div>
            {showModal && (
              <div className="payment-modal">
                <div className="payment-box">
                  <h3>Scan to Pay</h3>
                  <div className="qr-placeholder">[ QR Code Placeholder ]</div>
                  <button className="confirm-btn" onClick={() => alert('Payment not implemented yet.')}>
                    Confirm Payment
                  </button>
                  <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            )}


            </div>

            </div>
            <p className="payment-note">Secure payment. Cancel anytime.</p>
          </div>
        </main>

  );
}
