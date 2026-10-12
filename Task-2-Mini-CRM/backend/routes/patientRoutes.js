const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile,
  getAppointments,
  getHistory,
  getPatientById
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Protected routes for patients
router.use(protect);
router.use(authorize('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/appointments', getAppointments);
router.get('/history', getHistory);

// Doctor can access patient by ID
router.get('/:id', authorize('doctor', 'admin'), getPatientById);

module.exports = router;
