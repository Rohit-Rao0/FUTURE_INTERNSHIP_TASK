const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  getDoctorById, 
  getAllDoctors, 
  updateProfile,
  getAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
  getDashboard
} = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/doctors', getAllDoctors);
router.get('/doctors/:id', getDoctorById);
router.get('/slots/:doctorId/:date', getAvailableSlots);

// Protected routes
router.use(protect);

router.get('/profile', authorize('doctor'), getProfile);
router.put('/profile', authorize('doctor'), updateProfile);
router.get('/appointments', authorize('doctor'), getAppointments);
router.put('/appointments/:id', authorize('doctor'), updateAppointmentStatus);
router.get('/dashboard', authorize('doctor'), getDashboard);

module.exports = router;
