import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const roleConfig = {
  admin: {
    name: 'Admin',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
    color: '#8B5CF6'
  },
  doctor: {
    name: 'Doctor',
    icon: '👨‍⚕️',
    gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
    color: '#0D9488'
  },
  patient: {
    name: 'Patient',
    icon: '🤒',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: '#6366F1'
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams();

  // Default to patient if no role specified
  const currentRole = role && roleConfig[role] ? role : 'patient';
  const config = roleConfig[currentRole];

  const { email, password } = formData;

  useEffect(() => {
    // Redirect to role selection if invalid role
    if (role && !roleConfig[role]) {
      navigate('/auth');
    }
  }, [role, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card role-auth-card">
          <div className="role-badge" style={{ background: config.gradient }}>
            <span className="role-badge-icon">{config.icon}</span>
            <span>{config.name} Login</span>
          </div>

          <div className="auth-header">
            <h1>🏥 VedacureMe</h1>
            <p>Hospital Management System</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={loading}
              style={{ background: config.gradient, border: 'none' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to={`/register/${currentRole}`}>Register here</Link>
            </p>
            <p className="auth-footer-secondary">
              <Link to="/auth">← Back to role selection</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
