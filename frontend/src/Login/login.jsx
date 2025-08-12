import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

    // Google OAuth callback
  const handleGoogleCredential = async (response) => {
    const idToken = response.credential;
    try {
      const resp = await fetch("https://fyp-backend-a0i8.onrender.com/api/accounts/oauth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });
      const data = await resp.json();

      if (resp.status === 201 && data.needs_profile_completion) {
        navigate("/registerAccount", {
          state: {
            fromGoogle: true,
            profile: {
              email: data.email,
              username: data.username,
              name: data.name,
              avatar_url: data.avatar_url
            },
            accountId: data.account_id
          }
        });
        return;
      }

      if (resp.ok && data.account) {
        localStorage.setItem("account", JSON.stringify(data.account));
        localStorage.setItem("authToken", "authenticated");
        localStorage.setItem("accountId", data.account.account_id);

        if (data.account.role_id && data.account.role) {
            localStorage.setItem('role', JSON.stringify(data.account.role));
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
        navigate("/dashboard");
        return;
      }

      setError(data.detail || data.message || "Google login failed");
    } catch (err) {
      console.error(err);
      setError("Google login failed. Try again.");
    }
  };

  // Load Google script on mount
  useEffect(() => {
    const clientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Trigger Google One Tap manually on button click
  const handleGoogleLoginClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError("Google login not available. Try again later.");
    }
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
          onClick={handleGoogleLoginClick}
          disabled={loading}
>
          <span className="google-icon" aria-hidden="true">
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M9 3.48c1.39 0 2.64.48 3.62 1.43l2.41-2.41C13.63.83 11.49 0 9 0 5.48 0 2.44 2.02 1.11 4.96l2.98 2.31C4.82 5.17 6.73 3.48 9 3.48z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.68-.8 6.24-2.18l-2.87-2.35C11.45 14 10.3 14.4 9 14.4c-2.27 0-4.18-1.69-4.91-3.78l-3 2.32C2.42 15.98 5.47 18 9 18z"/>
              <path fill="#FBBC05" d="M4.09 10.62A5.41 5.41 0 0 1 3.78 9c0-.56.1-1.1.29-1.62l-3-2.32A9 9 0 0 0 0 9c0 1.46.35 2.82.98 4.04l3.11-2.42z"/>
              <path fill="#4285F4" d="M18 9c0-.6-.06-1.04-.17-1.5H9v3h5.22c-.26 1.3-1 2.3-2.12 3.02l2.87 2.35C16.92 14.7 18 12.13 18 9z"/>
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