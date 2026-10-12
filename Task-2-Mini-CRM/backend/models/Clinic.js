const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Clinic name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  workingHours: {
    type: String,
    default: 'Mon-Sat: 9:00 AM - 6:00 PM'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Clinic', clinicSchema);
