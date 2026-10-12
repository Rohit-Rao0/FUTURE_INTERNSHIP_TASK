const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor,
  getAllPatients,
  updatePatient,
  deletePatient,
  getAllAppointments,
  getReports,
  getClinic,
  updateClinic
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/doctors', getAllDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/patients', getAllPatients);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);
router.get('/appointments', getAllAppointments);
router.get('/reports', getReports);
router.get('/clinic', getClinic);
router.put('/clinic', updateClinic);

module.exports = router;
