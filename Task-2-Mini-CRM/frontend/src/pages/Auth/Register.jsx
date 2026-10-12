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

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { role: urlRole } = useParams();

  // Default to patient if no role specified
  const currentRole = urlRole && roleConfig[urlRole] ? urlRole : 'patient';
  const config = roleConfig[currentRole];

  // Update role when URL changes
  useEffect(() => {
    if (urlRole && roleConfig[urlRole]) {
      setFormData(prev => ({ ...prev, role: urlRole }));
    }
  }, [urlRole]);

  useEffect(() => {
    // Redirect to role selection if invalid role
    if (urlRole && !roleConfig[urlRole]) {
      navigate('/auth');
    }
  }, [urlRole, navigate]);

  const { firstName, lastName, email, phone, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        role: currentRole
      };
      
      await register(userData);
      
      // Show success message and redirect to login
      alert('Registration successful! Please login with your credentials.');
      navigate(`/login/${currentRole}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <span>{config.name} Registration</span>
          </div>

          <div className="auth-header">
            <h1>🏥 VedacureMe</h1>
            <p>Create your {config.name.toLowerCase()} account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="register-form">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={onChange}
                  className="form-input"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Last name"
                  required
                />
              </div>

              <div className="form-group full-width">
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

              <div className="form-group full-width">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Phone number"
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
                  placeholder="Create password"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={loading}
              style={{ background: config.gradient, border: 'none' }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to={`/login/${currentRole}`}>Login here</Link>
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

export default Register;
