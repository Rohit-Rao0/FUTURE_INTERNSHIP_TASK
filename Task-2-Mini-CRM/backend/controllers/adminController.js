const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Clinic = require('../models/Clinic');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get counts
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await Patient.countDocuments();
    
    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // All appointments
    const totalAppointments = await Appointment.countDocuments();

    // Appointment statuses
    const scheduledCount = await Appointment.countDocuments({ status: 'scheduled' });
    const completedCount = await Appointment.countDocuments({ status: 'completed' });
    const cancelledCount = await Appointment.countDocuments({ status: 'cancelled' });

    // Recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patientId', 'userId')
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate('doctorId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get clinic info
    const clinic = await Clinic.findOne();

    res.json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        todayAppointments,
        totalAppointments,
        scheduledCount,
        completedCount,
        cancelledCount
      },
      recentAppointments,
      clinic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'firstName lastName email phone isActive')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, specialization, qualification, experience, consultationFee, ...doctorData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role: 'doctor',
      firstName,
      lastName,
      phone
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization: specialization || 'General',
      qualification: qualification || '',
      experience: experience || 0,
      consultationFee: consultationFee || 500,
      ...doctorData
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      doctor: populatedDoctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private/Admin
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialization, qualification, experience, consultationFee, dailyAppointmentLimit, isAvailable, ...userData } = req.body;

    // Find doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Update user data
    if (Object.keys(userData).length > 0) {
      await User.findByIdAndUpdate(doctor.userId, userData);
    }

    // Update doctor data
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { specialization, qualification, experience, consultationFee, dailyAppointmentLimit, isAvailable },
      { new: true }
    ).populate('userId', 'firstName lastName email phone');

    res.json({
      success: true,
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete doctor profile
    await Doctor.findByIdAndDelete(id);
    
    // Delete user
    await User.findByIdAndDelete(doctor.userId);

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private/Admin
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'firstName lastName email phone isActive')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      patients
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/admin/patients/:id
// @access  Private/Admin
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, ...patientData } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update user data
    if (firstName || lastName || phone) {
      await User.findByIdAndUpdate(patient.userId, { firstName, lastName, phone });
    }

    // Update patient data
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      patientData,
      { new: true }
    ).populate('userId', 'firstName lastName email phone');

    res.json({
      success: true,
      patient: updatedPatient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/admin/patients/:id
// @access  Private/Admin
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete patient profile
    await Patient.findByIdAndDelete(id);
    
    // Delete user
    await User.findByIdAndDelete(patient.userId);

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private/Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctorId, patientId } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reports
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate) : new Date();

    let appointments;
    
    if (type === 'doctor') {
      // Doctor-wise report
      const doctors = await Doctor.find().populate('userId', 'firstName lastName');
      const doctorStats = await Promise.all(doctors.map(async (doctor) => {
        const count = await Appointment.countDocuments({
          doctorId: doctor._id,
          appointmentDate: { $gte: start, $lte: end }
        });
        return {
          doctor: doctor.userId,
          doctorId: doctor._id,
          specialization: doctor.specialization,
          count
        };
      }));
      
      return res.json({
        success: true,
        report: doctorStats
      });
    } else {
      // Date-wise report
      appointments = await Appointment.find({
        appointmentDate: { $gte: start, $lte: end }
      })
        .populate({
          path: 'patientId',
          populate: { path: 'userId', select: 'firstName lastName' }
        })
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'firstName lastName' }
        })
        .sort({ appointmentDate: -1 });

      // Group by date
      const dateStats = {};
      appointments.forEach(apt => {
        const dateKey = new Date(apt.appointmentDate).toISOString().split('T')[0];
        if (!dateStats[dateKey]) {
          dateStats[dateKey] = { date: dateKey, total: 0, scheduled: 0, completed: 0, cancelled: 0 };
        }
        dateStats[dateKey].total++;
        if (apt.status === 'scheduled') dateStats[dateKey].scheduled++;
        if (apt.status === 'completed') dateStats[dateKey].completed++;
        if (apt.status === 'cancelled') dateStats[dateKey].cancelled++;
      });

      return res.json({
        success: true,
        report: Object.values(dateStats),
        appointments
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get clinic settings
// @route   GET /api/admin/clinic
// @access  Private/Admin
exports.getClinic = async (req, res) => {
  try {
    let clinic = await Clinic.findOne();
    
    if (!clinic) {
      // Create default clinic
      clinic = await Clinic.create({
        name: 'VedacureMe Hospital',
        address: '123 Healthcare Street',
        city: 'Medical City',
        state: 'State',
        pincode: '123456',
        phone: '+91 1234567890',
        email: 'contact@vedacureme.com',
        workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM'
      });
    }

    res.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update clinic settings
// @route   PUT /api/admin/clinic
// @access  Private/Admin
exports.updateClinic = async (req, res) => {
  try {
    let clinic = await Clinic.findOne();
    
    if (clinic) {
      clinic = await Clinic.findByIdAndUpdate(clinic._id, req.body, { new: true });
    } else {
      clinic = await Clinic.create(req.body);
    }

    res.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
