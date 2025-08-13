import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './forgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  // Validate password requirements
  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    checkPasswordRequirements(value);
    if (error) setError('');
  };

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  // Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/accounts/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send OTP');
      }

      setSuccess('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message || 'An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/accounts/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid OTP');
      }

      setSuccess('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.message || 'An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

    if (!allRequirementsMet) {
      setError('Password does not meet the requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/accounts/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1 className="forgot-title">Forgot Password</h1>

        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{
            color: '#155724',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}>
          {/* Step 1: Email input */}
          {step === 1 && (
            <input
              type="email"
              className="forgot-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
              disabled={loading}
            />
          )}

          {/* Step 2: OTP input */}
          {step === 2 && (
            <>
              <div className="frgtpassdivider">
                <span className="frgtpassdivider-text">
                  Enter the 4-digit OTP sent to your email
                </span>
              </div>
              <input
                type="text"
                className="forgototp-input"
                placeholder="OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError('');
                }}
                maxLength={4}
                required
                disabled={loading}
              />
            </>
          )}

          {/* Step 3: New Password input */}
          {step === 3 && (
            <>
              <input
                type="password"
                className="forgot-input"
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
              <input
                type="password"
                className="forgot-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                disabled={loading}
              />
              <div className="password-requirements">
                <div className={`requirement ${passwordRequirements.length ? 'met' : 'unmet'}`}>
                  • At least 8 characters
                </div>
                <div className={`requirement ${passwordRequirements.number ? 'met' : 'unmet'}`}>
                  • One number
                </div>
                <div className={`requirement ${passwordRequirements.uppercase ? 'met' : 'unmet'}`}>
                  • One uppercase letter
                </div>
                <div className={`requirement ${passwordRequirements.lowercase ? 'met' : 'unmet'}`}>
                  • One lowercase letter
                </div>
                <div className={`requirement ${passwordRequirements.special ? 'met' : 'unmet'}`}>
                  • One special character
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={step === 1 ? 'send-otp-btn' : step === 2 ? 'otpverify-btn' : 'reset-password-btn'}
            disabled={loading}
          >
            {loading
              ? (step === 1 ? 'Sending…' : step === 2 ? 'Verifying…' : 'Resetting…')
              : (step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password')}
          </button>
        </form>

        <div className="frgtsignin-link">
          Remembered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}