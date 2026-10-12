const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private/Patient
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

    // Validate doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor is not available' });
    }

    // Get patient
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check for existing appointment
    const appointmentDateObj = new Date(appointmentDate);
    const startOfDay = new Date(appointmentDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      patientId: patient._id,
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'You already have an appointment for this time slot' });
    }

    // Check if slot is already booked
    const slotBooked = await Appointment.findOne({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (slotBooked) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate: appointmentDateObj,
      timeSlot,
      symptoms,
      status: 'scheduled'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      });

    res.status(201).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { status, date, doctorId, patientId, page = 1, limit = 10 } = req.query;
    
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

    const skip = (page - 1) * limit;
    
    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName email phone' }
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot, symptoms } = req.body;
    
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const isPatient = patient && appointment.patientId.toString() === patient._id.toString();
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Can only update certain fields based on role
    if (isPatient && appointmentDate) {
      appointment.appointmentDate = appointmentDate;
    }
    if (isPatient && timeSlot) {
      appointment.timeSlot = timeSlot;
    }
    if (isPatient && symptoms !== undefined) {
      appointment.symptoms = symptoms;
    }
    
    // Doctor can update diagnosis, prescription, notes
    if (isDoctor || isAdmin) {
      if (req.body.status) appointment.status = req.body.status;
      if (req.body.diagnosis) appointment.diagnosis = req.body.diagnosis;
      if (req.body.prescription) appointment.prescription = req.body.prescription;
      if (req.body.notes) appointment.notes = req.body.notes;
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'firstName lastName email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      });

    res.json({
      success: true,
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const isPatient = patient && appointment.patientId.toString() === patient._id.toString();
    const isDoctor = doctor && appointment.doctorId.toString() === doctor._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Cannot cancel completed appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user._id;
    appointment.cancellationReason = cancellationReason || 'Cancelled by user';

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available slots for a doctor on a date
// @route   GET /api/appointments/slots/:doctorId/:date
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
