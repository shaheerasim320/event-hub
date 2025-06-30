import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['music', 'sports', 'business', 'technology', 'food', 'art', 'education', 'other']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: 1
  },
  price: {
    type: Number,
    required: [true, 'Event price is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stripeProductId: {
    type: String
  },
  stripePriceId: {
    type: String
  },
  bookedSeats: {
    type: Number,
    default: 0
  },
  availableSeats: {
    type: Number,
    default: function() {
      return this.capacity;
    }
  }
}, {
  timestamps: true
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.bookedSeats >= this.capacity;
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return new Date() < this.dateTime.start;
});

// Virtual for checking if event is ongoing
eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return now >= this.dateTime.start && now <= this.dateTime.end;
});

// Virtual for checking if event is past
eventSchema.virtual('isPast').get(function() {
  return new Date() > this.dateTime.end;
});

// Update available seats when booked seats change
eventSchema.pre('save', function(next) {
  this.availableSeats = this.capacity - this.bookedSeats;
  next();
});

// Index for better query performance
eventSchema.index({ status: 1, dateTime: { start: 1 } });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ organizer: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema); 