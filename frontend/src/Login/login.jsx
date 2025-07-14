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
      const response = await fetch('http://localhost:8000/api/accounts/login', {
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
          navigate('/agentModel');
          return;
        } else if (profileName === 'admin' || profileName.includes('admin')) {
          navigate('/admin/home');
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
          placeholder="Pick a password"
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
          <span className="google-icon">G</span> Login with Google
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