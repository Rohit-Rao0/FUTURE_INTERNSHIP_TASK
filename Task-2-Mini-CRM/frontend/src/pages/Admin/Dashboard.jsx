import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.stats);
      setRecentAppointments(response.data.recentAppointments || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-error',
      'no-show': 'badge-warning'
    };
    return statusMap[status] || 'badge-primary';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to VedacureMe Hospital Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalDoctors || 0}</div>
            <div className="stat-label">Total Doctors</div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalPatients || 0}</div>
            <div className="stat-label">Total Patients</div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.todayAppointments || 0}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.completedCount || 0}</div>
            <div className="stat-label">Completed Appointments</div>
          </div>
        </div>
      </div>

      {/* Appointment Status Overview */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Appointment Overview</h3>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">
            <span className="overview-value">{stats?.totalAppointments || 0}</span>
            <span className="overview-label">Total Appointments</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value text-info">{stats?.scheduledCount || 0}</span>
            <span className="overview-label">Scheduled</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value text-success">{stats?.completedCount || 0}</span>
            <span className="overview-label">Completed</span>
          </div>
          <div className="overview-stat">
            <span className="overview-value text-error">{stats?.cancelledCount || 0}</span>
            <span className="overview-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Recent Appointments</h3>
          <a href="/admin/appointments" className="btn btn-sm btn-outline">View All</a>
        </div>
        
        {recentAppointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <div className="patient-info">
                        <span className="font-medium">
                          {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">
                        Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                      </span>
                    </td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.timeSlot}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No recent appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
