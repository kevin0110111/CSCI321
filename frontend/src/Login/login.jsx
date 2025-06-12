import './login.css';

export default function Login() {
  return (
    <div className="login-container">
      <form className="login-box">
        <h2 className="login-title">Sign In</h2>

        <input
          type="text"
          placeholder="Your user name"
          className="login-input"
        />

        <input
          type="password"
          placeholder="Pick a password"
          className="login-input"
        />

        <div className="login-options">
          <a href="#" className="forgot-link">Forget password?</a>
        </div>

        <button className="google-btn">
          <span className="google-icon">G</span> Login with Google
        </button>

        <button className="login-btn">Log in</button>

        <div className="register-link">
          <a href="#">Register a new account</a>
        </div>
      </form>
    </div>
  );
}
