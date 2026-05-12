import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign In to Vibe</h1>
        {error && <div style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="auth-button">LOG IN</button>
        </form>
        <Link to="/register" className="auth-link">
          Don't have an account? <span>Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
