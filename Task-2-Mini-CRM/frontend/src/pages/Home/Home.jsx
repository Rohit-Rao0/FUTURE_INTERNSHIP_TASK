import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      title: 'Expert Doctors',
      description: 'Connect with experienced medical professionals across various specialties',
      color: 'var(--primary)'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: 'Easy Appointments',
      description: 'Book appointments online anytime, anywhere with just a few clicks',
      color: 'var(--secondary)'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      title: 'Quality Healthcare',
      description: 'Receive top-notch medical care with our comprehensive hospital services',
      color: 'var(--success)'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'Digital Records',
      description: 'Access your medical records and history securely anytime',
      color: 'var(--accent)'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Patients' },
    { number: '150+', label: 'Expert Doctors' },
    { number: '50+', label: 'Medical Specialties' },
    { number: '24/7', label: 'Emergency Care' }
  ];

  const departments = [
    { name: 'Cardiology', icon: '❤️', doctors: 25 },
    { name: 'Neurology', icon: '🧠', doctors: 18 },
    { name: 'Orthopedics', icon: '🦴', doctors: 20 },
    { name: 'Pediatrics', icon: '👶', doctors: 15 },
    { name: 'Dermatology', icon: '🧴', doctors: 12 },
    { name: 'Ophthalmology', icon: '👁️', doctors: 10 }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Trusted by 5000+ Patients
            </div>
            <h1 className="hero-title">
              Your Health Is Our <span className="text-highlight">Priority</span>
            </h1>
            <p className="hero-description">
              Experience world-class healthcare management with VedacureMe. 
              Book appointments, manage records, and connect with expert doctors - all in one place.
            </p>
            <div className="hero-buttons">
              <Link to="/auth" className="btn btn-primary btn-lg">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/auth" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <span className="hero-stat-number">{stat.number}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-card">
              <div className="hero-image-icon">🏥</div>
              <h3>VedacureMe</h3>
              <p>Hospital Management System</p>
              <div className="hero-image-badge">
                <span>✓</span> Trusted Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Why Choose Us</span>
            <h2>Comprehensive Healthcare Solutions</h2>
            <p>We provide end-to-end hospital management services for patients, doctors, and administrators</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Departments</span>
            <h2>Medical Specialties</h2>
            <p>Expert care across multiple medical disciplines</p>
          </div>
          <div className="departments-grid">
            {departments.map((dept, index) => (
              <div key={index} className="department-card">
                <div className="department-icon">{dept.icon}</div>
                <h3>{dept.name}</h3>
                <p>{dept.doctors}+ Expert Doctors</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">For Everyone</span>
            <h2>Portal For All Users</h2>
            <p> tailored solutions for patients, doctors, and administrators</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon-wrapper">
                  <span>🤒</span>
                </div>
                <h3>Patient Portal</h3>
              </div>
              <ul className="service-features">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Book appointments online
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Browse specialist doctors
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  View medical records
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Track appointment history
                </li>
              </ul>
              <Link to="/auth" className="btn btn-primary w-full">Patient Login</Link>
            </div>
            
            <div className="service-card featured">
              <div className="featured-tag">Most Popular</div>
              <div className="service-header">
                <div className="service-icon-wrapper doctor">
                  <span>👨‍⚕️</span>
                </div>
                <h3>Doctor Portal</h3>
              </div>
              <ul className="service-features">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Manage patient appointments
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Access patient records
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Set availability schedule
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  View dashboard analytics
                </li>
              </ul>
              <Link to="/auth" className="btn btn-secondary w-full">Doctor Login</Link>
            </div>
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon-wrapper admin">
                  <span>⚙️</span>
                </div>
                <h3>Admin Portal</h3>
              </div>
              <ul className="service-features">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Manage doctors & patients
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Oversee appointments
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Generate reports & analytics
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Configure clinic settings
                </li>
              </ul>
              <Link to="/auth" className="btn btn-primary w-full">Admin Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of patients and healthcare professionals using VedacureMe</p>
            <div className="cta-buttons">
              <Link to="/auth" className="btn btn-white btn-lg">
                Register Now - It's Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>🏥 VedacureMe</h3>
              <p>Your trusted partner in healthcare management. Providing quality healthcare solutions for everyone.</p>
              <div className="footer-social">
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/auth">Login</Link></li>
                <li><Link to="/auth">Register</Link></li>
                <li><Link to="/auth">About Us</Link></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact Info</h4>
              <p>📍 123 Healthcare Street, Medical City, MC 12345</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>✉️ support@vedacureme.com</p>
              <p>🕐 Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 VedacureMe. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

