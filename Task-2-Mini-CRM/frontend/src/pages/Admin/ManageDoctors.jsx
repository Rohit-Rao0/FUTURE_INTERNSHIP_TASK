import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    dailyAppointmentLimit: 20,
    isAvailable: true
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getDoctors();
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await adminAPI.updateDoctor(editingDoctor._id, formData);
      } else {
        await adminAPI.createDoctor(formData);
      }
      fetchDoctors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving doctor');
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      firstName: doctor.userId.firstName,
      lastName: doctor.userId.lastName,
      email: doctor.userId.email,
      phone: doctor.userId.phone || '',
      password: '',
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      dailyAppointmentLimit: doctor.dailyAppointmentLimit,
      isAvailable: doctor.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting doctor');
      }
    }
  };

  const resetForm = () => {
    setEditingDoctor(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      specialization: '',
      qualification: '',
      experience: '',
      consultationFee: '',
      dailyAppointmentLimit: 20,
      isAvailable: true
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="manage-doctors">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Manage Doctors</h1>
          <p>Add, edit, and manage doctor profiles</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Add Doctor
        </button>
      </div>

      <div className="card">
        {doctors.length > 0 ? (
          <div className="doctors-list">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-avatar">
                  {doctor.userId.firstName[0]}{doctor.userId.lastName[0]}
                </div>
                <div className="doctor-details">
                  <div className="doctor-name">
                    Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                    {!doctor.isAvailable && <span className="badge badge-error ml-2">Unavailable</span>}
                  </div>
                  <div className="doctor-specialization">{doctor.specialization}</div>
                  <div className="doctor-meta">
                    <span>📧 {doctor.userId.email}</span>
                    <span>📞 {doctor.userId.phone || 'N/A'}</span>
                    <span>💰 ₹{doctor.consultationFee}</span>
                    <span>📅 {doctor.experience} years exp.</span>
                  </div>
                </div>
                <div className="doctor-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(doctor)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doctor._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No doctors found. Add your first doctor!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {!editingDoctor && (
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                      required={!editingDoctor}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qualification</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="form-input"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Daily Appointment Limit</label>
                    <input
                      type="number"
                      name="dailyAppointmentLimit"
                      value={formData.dailyAppointmentLimit}
                      onChange={handleChange}
                      className="form-input"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select
                      name="isAvailable"
                      value={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                      className="form-select"
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDoctor ? 'Update' : 'Add'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
