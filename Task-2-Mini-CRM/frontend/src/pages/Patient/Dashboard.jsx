import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import './Patient.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await patientAPI.getAppointments({ status: 'scheduled' });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
    <div className="patient-dashboard">
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Manage your health appointments</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mb-6">
        <a href="/patient/doctors" className="action-card">
          <div className="action-icon">👨‍⚕️</div>
          <div className="action-text">
            <h4>Find a Doctor</h4>
            <p>Browse our specialists</p>
          </div>
        </a>
        <a href="/patient/book-appointment" className="action-card">
          <div className="action-icon">📅</div>
          <div className="action-text">
            <h4>Book Appointment</h4>
            <p>Schedule a visit</p>
          </div>
        </a>
        <a href="/patient/appointments" className="action-card">
          <div className="action-icon">📋</div>
          <div className="action-text">
            <h4>My Appointments</h4>
            <p>View your history</p>
          </div>
        </a>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Upcoming Appointments</h3>
          <a href="/patient/appointments" className="btn btn-sm btn-outline">View All</a>
        </div>

        {appointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <span className="font-medium">
                        Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                      </span>
                    </td>
                    <td>{appointment.doctorId?.specialization}</td>
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
            <a href="/patient/book-appointment" className="btn btn-primary mt-4">
              Book Your First Appointment
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
