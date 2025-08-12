import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call login API
      const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        if (text.includes('<html')) {
          throw new Error('Server returned HTML page. Check API endpoint configuration.');
        }
      }

      // First check if response is OK and has content
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Store account info in localStorage or context
      localStorage.setItem('account', JSON.stringify(data.account));
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('accountId', data.account.account_id);

      // Check if account has a role assigned
      if (data.account.role_id && data.account.role) {
        // Store role info (it's already included in the account response)
        localStorage.setItem('role', JSON.stringify(data.account.role));

        // Route based on role name/type
        const profileName = data.account.role.role_name.toLowerCase();
        
        if (profileName === 'user' || profileName.includes('user')) {
          navigate('/user/dashboard');
          return;
        } else if (profileName === 'agent' || profileName.includes('agent')) {
          navigate('/agentComment');
          return;
        } else if (profileName === 'admin' || profileName.includes('admin')) {
          navigate('/admin/view-accounts');
          return;
        }
      }

      // Default navigation if no role is assigned
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login (placeholder for OAuth implementation)
  const handleGoogleLogin = () => {
    setError('Google login is not implemented yet');
    // TODO: Implement Google OAuth
    // This would typically redirect to Google OAuth endpoint
    // window.location.href = '/api/auth/google';
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign In</h2>

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

        <input
          type="text"
          name="username"
          placeholder="Your user name"
          className="login-input"
          value={formData.username}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="login-input"
          value={formData.password}
          onChange={handleInputChange}
          disabled={loading}
          required
        />

        <div className="login-options">
          <Link to="/forgotPassword" className="forgot-link">Forget password?</Link>
        </div>

        <button 
  type="button"
  className="google-btn"
  onClick={handleGoogleLogin}
  disabled={loading}
>
          <span className="google-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.9 32.9 30.1 36 24 36c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 3l6-6C34.6 3.1 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11 0 21-8 21-22 0-1.4-.2-2.8-.5-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C14.9 16 19.1 13 24 13c3.1 0 5.9 1.1 8.1 3l6-6C34.6 6.1 29.6 4 24 4 16 4 8.9 8.6 6.3 14.7z"/>
              <path fill="#FBBC05" d="M24 45c6 0 11.4-2.3 15.2-6l-7-5.8C30.5 34.9 27.5 36 24 36c-6.1 0-10.9-3.1-13.4-7.7l-7 5.4C6.2 40.5 14.4 45 24 45z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1.3 3.9-5.1 7.5-11.8 7.5-6.5 0-12-5.2-12-12s5.5-12 12-12c3.1 0 5.9 1.1 8.1 3l6-6C34.6 5.1 29.6 3 24 3 12.3 3 2.7 12.2 2.7 24S12.3 45 24 45c11.7 0 21.3-8.5 21.3-21 0-1.7-.2-3.1-.8-4z"/>
            </svg>
          </span>
          <span>Login with Google</span>
        </button>

        <button 
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <div className="register-link">
          <Link to="/registerAccount">Register a new account</Link>
        </div>
      </form>
    </div>
  );
}