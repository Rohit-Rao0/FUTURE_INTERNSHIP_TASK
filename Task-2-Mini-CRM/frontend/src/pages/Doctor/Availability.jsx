import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import './Doctor.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Availability = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState(
    DAYS.map(day => ({
      day,
      isAvailable: false,
      startTime: '09:00',
      endTime: '17:00',
      maxAppointments: 10
    }))
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setProfile(response.data.doctor);
      if (response.data.doctor.availability && response.data.doctor.availability.length > 0) {
        const existingAvailability = response.data.doctor.availability;
        setAvailability(
          DAYS.map(day => {
            const existing = existingAvailability.find(a => a.day === day);
            return existing || {
              day,
              isAvailable: false,
              startTime: '09:00',
              endTime: '17:00',
              maxAppointments: 10
            };
          })
        );
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const filteredAvailability = availability.filter(a => a.isAvailable);
      await doctorAPI.updateProfile({ availability: filteredAvailability });
      alert('Availability updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="doctor-availability">
      <div className="page-header">
        <h1>Manage Availability</h1>
        <p>Set your working hours and appointment slots</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="availability-form">
          {availability.map((day, index) => (
            <div key={day.day} className="availability-day">
              <div className="availability-day-header">
                <h4>{day.day}</h4>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={day.isAvailable}
                    onChange={(e) => handleChange(index, 'isAvailable', e.target.checked)}
                  />
                  <span>Available</span>
                </label>
              </div>

              {day.isAvailable && (
                <div className="time-inputs">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Appointments</label>
                    <input
                      type="number"
                      value={day.maxAppointments}
                      onChange={(e) => handleChange(index, 'maxAppointments', parseInt(e.target.value))}
                      className="form-input"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Availability;
