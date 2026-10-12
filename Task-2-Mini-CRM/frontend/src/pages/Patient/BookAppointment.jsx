import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI } from '../../services/api';
import './Patient.css';

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: searchParams.get('doctorId') || '',
    appointmentDate: '',
    timeSlot: '',
    symptoms: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  useEffect(() => {
    if (formData.doctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d._id === formData.doctorId);
      setSelectedDoctorDetails(doctor);
    }
  }, [formData.doctorId, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors({ available: true });
      setDoctors(response.data.doctors);
      
      // If doctorId is in URL, set it
      const doctorId = searchParams.get('doctorId');
      if (doctorId) {
        setFormData(prev => ({ ...prev, doctorId }));
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await appointmentAPI.getAvailableSlots(
        formData.doctorId,
        formData.appointmentDate
      );
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, timeSlot: name === 'appointmentDate' ? '' : prev.timeSlot }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await appointmentAPI.createAppointment(formData);
      alert('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const allSlots = generateTimeSlots();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Schedule a visit with our specialists</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Doctor Selection */}
          <div className="form-group">
            <label className="form-label">Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.userId?.firstName} {doctor.userId?.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Doctor Info */}
          {selectedDoctorDetails && (
            <div className="appointment-detail-card mb-4">
              <h4>Doctor Details</h4>
              <p><strong>Dr. {selectedDoctorDetails.userId?.firstName} {selectedDoctorDetails.userId?.lastName}</strong></p>
              <p>{selectedDoctorDetails.specialization} | {selectedDoctorDetails.experience} years experience</p>
              <p>Consultation Fee: ₹{selectedDoctorDetails.consultationFee}</p>
            </div>
          )}

          {/* Date Selection */}
          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Time Slots */}
          {formData.appointmentDate && (
            <div className="form-group">
              <label className="form-label">Available Time Slots</label>
              <div className="time-slots">
                {allSlots.map(slot => {
                  const isBooked = availableSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot ${formData.timeSlot === slot ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                      onClick={() => !isBooked && setFormData(prev => ({ ...prev, timeSlot: slot }))}
                      disabled={isBooked}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {formData.timeSlot && (
                <p className="text-sm mt-2">Selected: <strong>{formData.timeSlot}</strong></p>
              )}
            </div>
          )}

          {/* Symptoms */}
          <div className="form-group">
            <label className="form-label">Symptoms / Reason for Visit</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Describe your symptoms or reason for visit..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !formData.doctorId || !formData.appointmentDate || !formData.timeSlot}
          >
            {submitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
