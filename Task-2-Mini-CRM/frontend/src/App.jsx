import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RoleSelection from './pages/Auth/RoleSelection';
import Home from './pages/Home/Home';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import ManageDoctors from './pages/Admin/ManageDoctors';
import ManagePatients from './pages/Admin/ManagePatients';
import ManageAppointments from './pages/Admin/ManageAppointments';
import Reports from './pages/Admin/Reports';
import ClinicSettings from './pages/Admin/ClinicSettings';

// Doctor Pages
import DoctorDashboard from './pages/Doctor/Dashboard';
import DoctorAppointments from './pages/Doctor/Appointments';
import DoctorAvailability from './pages/Doctor/Availability';

// Patient Pages
import PatientDashboard from './pages/Patient/Dashboard';
import BrowseDoctors from './pages/Patient/BrowseDoctors';
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';

// Layout
import Layout from './components/Layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Router - redirects to role-specific dashboard
const DashboardRouter = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - Home Page */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={
            <PublicRoute>
              <RoleSelection />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/login/:role" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/register/:role" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardRouter />} />
            
            {/* Admin Routes */}
            <Route path="admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/doctors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageDoctors />
              </ProtectedRoute>
            } />
            <Route path="admin/patients" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManagePatients />
              </ProtectedRoute>
            } />
            <Route path="admin/appointments" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageAppointments />
              </ProtectedRoute>
            } />
            <Route path="admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="admin/clinic" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ClinicSettings />
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="doctor/dashboard" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="doctor/appointments" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            } />
            <Route path="doctor/availability" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAvailability />
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="patient/dashboard" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="patient/doctors" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BrowseDoctors />
              </ProtectedRoute>
            } />
            <Route path="patient/book-appointment" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="patient/appointments" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MyAppointments />
              </ProtectedRoute>
            } />

            {/* Default redirect based on role */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
