const mongoose = require('mongoose');

const paidRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'eventModel'
  },
  eventModel: {
    type: String,
    required: true,
    enum: ['Event', 'EventSubmission', 'ClubsEvent']
  },
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  ticketsCount: {
    type: Number,
    required: true,
    default: 1
  },
  ticketType: {
    type: String
  },
  selectedTicket: {
    type: String
  },
  teamSize: {
    type: Number,
    default: 1
  },
  teamMembers: [{
    name: String,
    email: String,
    phone: String,
    customAnswers: [{
      question: String,
      answer: mongoose.Schema.Types.Mixed
    }]
  }],
  customAnswers: [{
    question: String,
    answer: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Index for fast query of user registrations
paidRegistrationSchema.index({ user: 1, event: 1 });

module.exports = mongoose.model('PaidRegistration', paidRegistrationSchema);
