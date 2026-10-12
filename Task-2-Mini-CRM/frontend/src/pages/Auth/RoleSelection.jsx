import { Link } from 'react-router-dom';
import './Auth.css';

const RoleSelection = () => {
  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      icon: '⚙️',
      description: 'Manage hospital operations',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)'
    },
    {
      id: 'doctor',
      name: 'Doctor',
      icon: '👨‍⚕️',
      description: 'Manage patients & appointments',
      color: '#0D9488',
      gradient: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)'
    },
    {
      id: 'patient',
      name: 'Patient',
      icon: '🤒',
      description: 'Book appointments & view records',
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
    }
  ];

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>🏥 VedacureMe</h1>
          <p>Hospital Management System</p>
          <h2>Select Your Role</h2>
        </div>

        <div className="role-cards">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="role-card"
              style={{ '--role-color': role.color }}
            >
              <div 
                className="role-card-icon"
                style={{ background: role.gradient }}
              >
                {role.icon}
              </div>
              <h3>{role.name}</h3>
              <p>{role.description}</p>
              
              <div className="role-card-actions">
                <Link 
                  to={`/login/${role.id}`} 
                  className="btn btn-outline"
                >
                  Login
                </Link>
                <Link 
                  to={`/register/${role.id}`} 
                  className="btn btn-primary"
                  style={{ background: role.gradient, border: 'none' }}
                >
                  Register
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="role-selection-footer">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

