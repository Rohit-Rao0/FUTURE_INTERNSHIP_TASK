const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getAppointments, 
  getAppointment, 
  updateAppointment,
  cancelAppointment,
  getAvailableSlots
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public route - get available slots
router.get('/slots/:doctorId/:date', getAvailableSlots);

// Protected routes
router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', cancelAppointment);

module.exports = router;
