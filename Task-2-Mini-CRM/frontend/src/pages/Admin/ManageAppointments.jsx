import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      
      const response = await adminAPI.getAppointments(params);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
    <div className="manage-appointments">
      <div className="page-header">
        <h1>Manage Appointments</h1>
        <p>View and track all appointments</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex gap-4 items-center">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="form-input"
            />
          </div>
          {filters.status || filters.date ? (
            <button 
              className="btn btn-light mt-4"
              onClick={() => setFilters({ status: '', date: '' })}
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="card">
        {appointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <span className="font-medium">
                        {appointment.patientId?.userId?.firstName} {appointment.patientId?.userId?.lastName}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium">
                        Dr. {appointment.doctorId?.userId?.firstName} {appointment.doctorId?.userId?.lastName}
                      </span>
                      <div className="text-sm text-secondary">
                        {appointment.doctorId?.specialization}
                      </div>
                    </td>
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.timeSlot}</td>
                    <td className="text-sm">{appointment.symptoms || 'N/A'}</td>
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
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;
