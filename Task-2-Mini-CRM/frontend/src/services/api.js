import axios from 'axios';

const API_URL = '/api';

// Auth API
export const authAPI = {
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  getMe: () => axios.get(`${API_URL}/auth/me`),
  logout: () => axios.post(`${API_URL}/auth/logout`)
};

// Admin API
export const adminAPI = {
  getDashboard: () => axios.get(`${API_URL}/admin/dashboard`),
  getDoctors: () => axios.get(`${API_URL}/admin/doctors`),
  createDoctor: (data) => axios.post(`${API_URL}/admin/doctors`, data),
  updateDoctor: (id, data) => axios.put(`${API_URL}/admin/doctors/${id}`, data),
  deleteDoctor: (id) => axios.delete(`${API_URL}/admin/doctors/${id}`),
  getPatients: () => axios.get(`${API_URL}/admin/patients`),
  updatePatient: (id, data) => axios.put(`${API_URL}/admin/patients/${id}`, data),
  deletePatient: (id) => axios.delete(`${API_URL}/admin/patients/${id}`),
  getAppointments: (params) => axios.get(`${API_URL}/admin/appointments`, { params }),
  getReports: (params) => axios.get(`${API_URL}/admin/reports`, { params }),
  getClinic: () => axios.get(`${API_URL}/admin/clinic`),
  updateClinic: (data) => axios.put(`${API_URL}/admin/clinic`, data)
};

// Doctor API
export const doctorAPI = {
  getProfile: () => axios.get(`${API_URL}/doctors/profile`),
  updateProfile: (data) => axios.put(`${API_URL}/doctors/profile`, data),
  getAllDoctors: (params) => axios.get(`${API_URL}/doctors/doctors`, { params }),
  getDoctorById: (id) => axios.get(`${API_URL}/doctors/doctors/${id}`),
  getAppointments: (params) => axios.get(`${API_URL}/doctors/appointments`, { params }),
  updateAppointment: (id, data) => axios.put(`${API_URL}/doctors/appointments/${id}`, data),
  getAvailableSlots: (doctorId, date) => axios.get(`${API_URL}/doctors/slots/${doctorId}/${date}`),
  getDashboard: () => axios.get(`${API_URL}/doctors/dashboard`)
};

// Patient API
export const patientAPI = {
  getProfile: () => axios.get(`${API_URL}/patients/profile`),
  updateProfile: (data) => axios.put(`${API_URL}/patients/profile`, data),
  getAppointments: (params) => axios.get(`${API_URL}/patients/appointments`, { params }),
  getHistory: () => axios.get(`${API_URL}/patients/history`)
};

// Appointment API
export const appointmentAPI = {
  create: (data) => axios.post(`${API_URL}/appointments`, data),
  getAll: (params) => axios.get(`${API_URL}/appointments`, { params }),
  getById: (id) => axios.get(`${API_URL}/appointments/${id}`),
  update: (id, data) => axios.put(`${API_URL}/appointments/${id}`, data),
  cancel: (id, data) => axios.delete(`${API_URL}/appointments/${id}`, { data }),
  getSlots: (doctorId, date) => axios.get(`${API_URL}/appointments/slots/${doctorId}/${date}`)
};
