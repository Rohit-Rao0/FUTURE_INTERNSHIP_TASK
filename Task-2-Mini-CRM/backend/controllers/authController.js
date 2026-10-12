const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, ...otherDetails } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      phone
    });

    // Create role-specific profile
    if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: otherDetails.specialization || 'General',
        qualification: otherDetails.qualification || '',
        experience: otherDetails.experience || 0,
        consultationFee: otherDetails.consultationFee || 500,
        availability: []
      });
    } else if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        dateOfBirth: otherDetails.dateOfBirth,
        gender: otherDetails.gender,
        bloodGroup: otherDetails.bloodGroup,
        address: otherDetails.address,
        city: otherDetails.city,
        state: otherDetails.state,
        pincode: otherDetails.pincode,
        emergencyContact: otherDetails.emergencyContact,
        emergencyContactName: otherDetails.emergencyContactName,
        medicalHistory: otherDetails.medicalHistory,
        allergies: otherDetails.allergies
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    let profileData = null;
    
    if (user.role === 'doctor') {
      profileData = await Doctor.findOne({ userId: user._id }).populate('userId', 'firstName lastName email phone');
    } else if (user.role === 'patient') {
      profileData = await Patient.findOne({ userId: user._id }).populate('userId', 'firstName lastName email phone');
    }

    res.json({
      success: true,
      user,
      profile: profileData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};
