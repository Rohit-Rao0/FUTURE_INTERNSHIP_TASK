import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorAPI } from '../../services/api';
import './Patient.css';

const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const fetchDoctors = async () => {
    try {
      const params = {};
      if (specialization) params.specialization = specialization;
      if (search) params.search = search;
      
      const response = await doctorAPI.getAllDoctors(params);
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  // Get unique specializations
  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="browse-doctors">
      <div className="page-header">
        <h1>Find a Doctor</h1>
        <p>Browse our specialist doctors</p>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              placeholder="Search by name or specialization..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="form-select"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Doctors List */}
      <div className="doctors-grid">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card-patient">
              <div className="doctor-avatar">
                {doctor.userId?.firstName?.[0]}{doctor.userId?.lastName?.[0]}
              </div>
              <div className="doctor-info">
                <h3>Dr. {doctor.userId?.firstName} {doctor.userId?.lastName}</h3>
                <div className="doctor-specialization">{doctor.specialization}</div>
                <div className="doctor-meta-info">
                  <span>📚 {doctor.experience} years experience</span>
                  <span>💰 ₹{doctor.consultationFee} per visit</span>
                  <span>🏥 {doctor.qualification}</span>
                </div>
                {doctor.bio && (
                  <p className="text-sm text-secondary mt-2">{doctor.bio}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Link 
                  to={`/patient/book-appointment?doctorId=${doctor._id}`}
                  className="btn btn-primary"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No doctors found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDoctors;
