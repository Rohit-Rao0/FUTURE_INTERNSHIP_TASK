const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private/Patient
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private/Patient
exports.updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const { firstName, lastName, phone, ...patientData } = req.body;

    // Update user data
    if (firstName || lastName || phone) {
      const user = req.user;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      await user.save();
    }

    // Update patient data
    const updatedPatient = await Patient.findByIdAndUpdate(
      patient._id,
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

// @desc    Get patient's appointments
// @route   GET /api/patients/appointments
// @access  Private/Patient
exports.getAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    
    const patient = await Patient.findOne({ userId: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    let query = { patientId: patient._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
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

// @desc    Get patient visit history
// @route   GET /api/patients/history
// @access  Private/Patient
exports.getHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointments = await Appointment.find({
      patientId: patient._id,
      status: 'completed'
    })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'firstName lastName' }
      })
      .select('appointmentDate timeSlot diagnosis prescription notes')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      history: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get patient by ID (for doctors)
// @route   GET /api/patients/:id
// @access  Private/Doctor
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
