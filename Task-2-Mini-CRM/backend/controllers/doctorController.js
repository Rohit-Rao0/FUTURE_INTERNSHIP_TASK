const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email phone');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    
    let query = { isAvailable: true };
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (search) {
      const doctors = await Doctor.find(query)
        .populate('userId', 'firstName lastName email phone');
      
      const filtered = doctors.filter(d => 
        d.userId.firstName.toLowerCase().includes(search.toLowerCase()) ||
        d.userId.lastName.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
      );
      
      return res.json({
        success: true,
        doctors: filtered
      });
    }

    const doctors = await Doctor.find(query)
      .populate('userId', 'firstName lastName email phone')
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

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
exports.updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { specialization, qualification, experience, consultationFee, bio, dailyAppointmentLimit, isAvailable, availability } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      { specialization, qualification, experience, consultationFee, bio, dailyAppointmentLimit, isAvailable, availability },
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

// @desc    Get doctor's appointments
// @route   GET /api/doctors/appointments
// @access  Private/Doctor
exports.getAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    let query = { doctorId: doctor._id };
    
    if (status) {
      query.status = status;
    }
    
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
        populate: { path: 'userId', select: 'firstName lastName email phone' }
      })
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/doctors/appointments/:id
// @access  Private/Doctor
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, diagnosis, prescription, notes } = req.body;
    
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctorId: doctor._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    appointment.diagnosis = diagnosis || appointment.diagnosis;
    appointment.prescription = prescription || appointment.prescription;
    appointment.notes = notes || appointment.notes;

    await appointment.save();

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available time slots
// @route   GET /api/doctors/slots/:doctorId/:date
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get day of week
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Find availability for that day
    const dayAvailability = doctor.availability.find(a => a.day === dayName);
    
    if (!dayAvailability) {
      return res.json({
        success: true,
        slots: [],
        message: 'Doctor not available on this day'
      });
    }

    // Get existing appointments for that date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    });

    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);

    // Generate time slots
    const slots = [];
    const startTime = dayAvailability.startTime;
    const endTime = dayAvailability.endTime;
    const slotDuration = 30; // 30 minutes

    let currentTime = startTime;
    while (currentTime < endTime) {
      const [hours, minutes] = currentTime.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const endTimeInMinutes = endTime.split(':').reduce((a, b) => a * 60 + parseInt(b));
      
      if (timeInMinutes + slotDuration > endTimeInMinutes) break;

      const slotEndTime = `${Math.floor((timeInMinutes + slotDuration) / 60)}:${(timeInMinutes + slotDuration) % 60}`.padStart(5, '0');
      const slotTime = `${currentTime}-${slotEndTime}`;
      
      if (!bookedSlots.includes(slotTime)) {
        slots.push({
          time: slotTime,
          available: true
        });
      }
      
      currentTime = `${Math.floor((timeInMinutes + slotDuration) / 60)}:${(timeInMinutes + slotDuration) % 60}`.padStart(5, '0');
    }

    res.json({
      success: true,
      slots,
      availability: dayAvailability
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats for doctor
// @route   GET /api/doctors/dashboard
// @access  Private/Doctor
exports.getDashboard = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({
      doctorId: doctor._id
    });

    // Completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'completed'
    });

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .sort({ appointmentDate: 1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        todayAppointments,
        totalAppointments,
        completedAppointments
      },
      upcomingAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
