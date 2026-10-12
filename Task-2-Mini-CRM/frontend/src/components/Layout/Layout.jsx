import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout, isAdmin, isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
        { path: '/admin/patients', label: 'Patients', icon: '👥' },
        { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
        { path: '/admin/clinic', label: 'Clinic Settings', icon: '⚙️' }
      ];
    }
    if (isDoctor) {
      return [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
        { path: '/doctor/availability', label: 'Availability', icon: '🕐' }
      ];
    }
    if (isPatient) {
      return [
        { path: '/patient/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/patient/doctors', label: 'Browse Doctors', icon: '👨‍⚕️' },
        { path: '/patient/book-appointment', label: 'Book Appointment', icon: '📅' },
        { path: '/patient/appointments', label: 'My Appointments', icon: '📋' }
      ];
    }
    return [];
  };

const getDefaultPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (isPatient) return '/patient/dashboard';
    return '/login';
  };

  // Routes handle redirection automatically

  const navLinks = getNavLinks();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">🏥 VedacureMe</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.firstName} {user?.lastName}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="header-right">
            <span className="welcome-text">Welcome, {user?.firstName}!</span>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
