import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import './Doctor.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ date: '', status: '' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    status: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (filter.date) params.date = filter.date;
      if (filter.status) params.status = filter.status;
      
      const response = await doctorAPI.getAppointments(params);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await doctorAPI.updateAppointment(selectedAppointment._id, appointmentForm);
      fetchAppointments();
      setSelectedAppointment(null);
      alert('Appointment updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating appointment');
    }
  };

  const openAppointmentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentForm({
      status: appointment.status,
      diagnosis: appointment.diagnosis || '',
      prescription: appointment.prescription || '',
      notes: appointment.notes || ''
    });
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
    <div className="doctor-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage your appointments</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex gap-4 items-center">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="form-select"
            >
              <option value="">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {(filter.date || filter.status) && (
            <button 
              className="btn btn-light mt-4"
              onClick={() => setFilter({ date: '', status: '' })}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        {appointments.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                    <td>{appointment.timeSlot}</td>
                    <td className="text-sm">{appointment.symptoms || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => openAppointmentModal(appointment)}
                      >
                        Update
                      </button>
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

      {/* Update Modal */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Update Appointment</h3>
              <button className="modal-close" onClick={() => setSelectedAppointment(null)}>×</button>
            </div>
            <form onSubmit={handleStatusUpdate}>
              <div className="modal-body">
                <div className="appointment-detail-card mb-4">
                  <h4>Patient Information</h4>
                  <p className="mt-2">
                    <strong>Name:</strong>{' '}
                    {selectedAppointment.patientId?.userId?.firstName}{' '}
                    {selectedAppointment.patientId?.userId?.lastName}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedAppointment.timeSlot}
                  </p>
                  <p>
                    <strong>Symptoms:</strong> {selectedAppointment.symptoms || 'N/A'}
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={appointmentForm.status}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Diagnosis</label>
                  <textarea
                    value={appointmentForm.diagnosis}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, diagnosis: e.target.value })}
                    className="form-input"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prescription</label>
                  <textarea
                    value={appointmentForm.prescription}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, prescription: e.target.value })}
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                    className="form-input"
                    rows="2"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setSelectedAppointment(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
