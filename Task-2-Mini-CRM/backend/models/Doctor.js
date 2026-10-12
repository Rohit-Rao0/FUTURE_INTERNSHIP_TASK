const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    trim: true
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    maxAppointments: {
      type: Number,
      default: 10
    }
  }],
  dailyAppointmentLimit: {
    type: Number,
    default: 20
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return `${this.userId.firstName} ${this.userId.lastName}`;
});

module.exports = mongoose.model('Doctor', doctorSchema);
