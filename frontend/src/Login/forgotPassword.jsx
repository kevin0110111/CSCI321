import { useState } from 'react';
import { Link } from 'react-router-dom';
import './forgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1) Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // ▶ call your API to send the email OTP here ◀
    console.log('Sending OTP to', email);
    await new Promise(r => setTimeout(r, 500)); // simulate network
    setOtpSent(true);
    setLoading(false);
  };

  // 2) Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    // ▶ call your API to verify here ◀
    console.log('Verifying OTP', otp);
    await new Promise(r => setTimeout(r, 500)); // simulate network
    setLoading(false);
    // on success: redirect / show reset‑password UI
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1 className="forgot-title">Forgot Password</h1>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          {/* Email field (always visible) */}
          <input
            type="email"
            className="forgot-input"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={otpSent}
          />

          {/* Divider + OTP field (only after sending) */}
          {otpSent && (
            <>
              <div className="frgtpassdivider">
                <span className="frgtpassdivider-text">
                  Enter the 4‑digit OTP
                </span>
              </div>
              <input
                type="text"
                className="forgototp-input"
                placeholder="OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={4}
                required
              />
            </>
          )}

          {/* Single button that toggles its label & action */}
          <button
            type="submit"
            className={otpSent ? 'otpverify-btn' : 'send-otp-btn'}
            disabled={loading}
          >
            {loading
              ? (otpSent ? 'Verifying…' : 'Sending…')
              : (otpSent ? 'Verify OTP' : 'Send OTP')}
          </button>
        </form>

        <div className="frgtsignin-link">
          Remembered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
