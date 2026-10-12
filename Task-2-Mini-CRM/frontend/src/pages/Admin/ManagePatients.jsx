import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await adminAPI.getPatients();
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
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
      if (editingPatient) {
        await adminAPI.updatePatient(editingPatient._id, formData);
      }
      fetchPatients();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving patient');
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.userId.firstName,
      lastName: patient.userId.lastName,
      email: patient.userId.email,
      phone: patient.userId.phone || '',
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      address: patient.address || '',
      city: patient.city || '',
      state: patient.state || '',
      pincode: patient.pincode || '',
      emergencyContact: patient.emergencyContact || '',
      medicalHistory: patient.medicalHistory || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminAPI.deletePatient(id);
        fetchPatients();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting patient');
      }
    }
  };

  const resetForm = () => {
    setEditingPatient(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      emergencyContact: '',
      medicalHistory: ''
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="manage-patients">
      <div className="page-header">
        <h1>Manage Patients</h1>
        <p>View and manage patient records</p>
      </div>

      <div className="card">
        {patients.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <div className="patient-info">
                        <span className="font-medium">
                          {patient.userId.firstName} {patient.userId.lastName}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>{patient.userId.email}</div>
                      <div className="text-sm text-secondary">{patient.userId.phone || 'N/A'}</div>
                    </td>
                    <td>{patient.gender || 'N/A'}</td>
                    <td>{patient.bloodGroup || 'N/A'}</td>
                    <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(patient)}>
                          View
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(patient._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No patients found</p>
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Patient Details</h3>
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
                      readOnly
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
                      readOnly
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
                      readOnly
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
