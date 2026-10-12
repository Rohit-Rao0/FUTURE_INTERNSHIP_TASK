const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  emergencyContactName: {
    type: String,
    trim: true
  },
  medicalHistory: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.userId.firstName} ${this.userId.lastName}`;
});

module.exports = mongoose.model('Patient', patientSchema);
