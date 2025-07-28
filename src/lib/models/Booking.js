import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: [true, 'Number of tickets is required'],
    min: 1
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String
  },
  stripeSessionId: {
    type: String
  },
  tickets: [{
    ticketId: {
      type: String,
      unique: true
    },
    attendeeName: String,
    attendeeEmail: String,
    isUsed: {
      type: Boolean,
      default: false
    },
    usedAt: Date
  }],
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique ticket IDs
bookingSchema.pre('save', function(next) {
  if (this.isNew && this.tickets.length === 0) {
    this.tickets = Array.from({ length: this.numberOfTickets }, (_, index) => ({
      ticketId: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index + 1}`,
      attendeeName: '',
      attendeeEmail: '',
      isUsed: false
    }));
  }
  next();
});

// Virtual for checking if booking is active
bookingSchema.virtual('isActive').get(function() {
  return this.status === 'confirmed' && this.paymentStatus === 'paid';
});

// Virtual for checking if booking can be cancelled
bookingSchema.virtual('canBeCancelled').get(function() {
  return this.status === 'confirmed' && this.paymentStatus === 'paid';
});

// Index for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1, status: 1 });
bookingSchema.index({ stripePaymentIntentId: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema); 