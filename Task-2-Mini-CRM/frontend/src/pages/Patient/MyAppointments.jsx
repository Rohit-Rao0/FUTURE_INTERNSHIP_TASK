import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import './Patient.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await patientAPI.getAppointments(params);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await patientAPI.cancelAppointment(appointmentId);
        fetchAppointments();
        alert('Appointment cancelled successfully!');
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling appointment');
      }
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
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage your appointment history</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilter('scheduled')}
        >
          Upcoming
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List */}
      <div className="card">
        {appointments.length > 0 ? (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-history-card">
                <div className="appointment-history-header">
                  <div>
                    <div className="appointment-history-doctor">
                      Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                    </div>
                    <div className="appointment-history-date">
                      {appointment.doctorId?.specialization}
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-history-details">
                  <p>
                    <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                    <span className="ml-3"><strong>Time:</strong> {appointment.timeSlot}</span>
                  </p>
                  {appointment.symptoms && (
                    <p><strong>Reason:</strong> {appointment.symptoms}</p>
                  )}
                  {appointment.diagnosis && (
                    <p><strong>Diagnosis:</strong> {appointment.diagnosis}</p>
                  )}
                  {appointment.prescription && (
                    <p><strong>Prescription:</strong> {appointment.prescription}</p>
                  )}
                </div>
                {appointment.status === 'scheduled' && (
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancel(appointment._id)}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
