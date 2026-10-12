import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const ClinicSettings = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    website: '',
    workingHours: '',
    description: ''
  });

  useEffect(() => {
    fetchClinic();
  }, []);

  const fetchClinic = async () => {
    try {
      const response = await adminAPI.getClinic();
      setClinic(response.data.clinic);
      if (response.data.clinic) {
        setFormData({
          name: response.data.clinic.name || '',
          address: response.data.clinic.address || '',
          city: response.data.clinic.city || '',
          state: response.data.clinic.state || '',
          pincode: response.data.clinic.pincode || '',
          phone: response.data.clinic.phone || '',
          email: response.data.clinic.email || '',
          website: response.data.clinic.website || '',
          workingHours: response.data.clinic.workingHours || '',
          description: response.data.clinic.description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching clinic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.updateClinic(formData);
      alert('Clinic settings updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating clinic settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading clinic settings...</p>
      </div>
    );
  }

  return (
    <div className="clinic-settings">
      <div className="page-header">
        <h1>Clinic Settings</h1>
        <p>Manage your clinic information</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Clinic Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
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
              required
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
                required
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
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="form-input"
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
              />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Working Hours</label>
            <input
              type="text"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              className="form-input"
              placeholder="Mon-Sat: 9:00 AM - 6:00 PM"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Brief description of your clinic..."
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicSettings;
