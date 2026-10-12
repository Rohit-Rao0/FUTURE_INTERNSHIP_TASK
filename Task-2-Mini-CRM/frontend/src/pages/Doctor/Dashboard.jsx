import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import './Doctor.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await doctorAPI.getDashboard();
      setStats(response.data.stats);
      setUpcomingAppointments(response.data.upcomingAppointments || []);
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
    <div className="doctor-dashboard">
      <div className="page-header">
        <h1>Doctor Dashboard</h1>
        <p>Manage your appointments and schedule</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.todayAppointments || 0}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalAppointments || 0}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats?.completedAppointments || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Upcoming Appointments</h3>
          <a href="/doctor/appointments" className="btn btn-sm btn-outline">View All</a>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <span className="font-medium">
                        {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
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
            <p>No upcoming appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
