// MongoDB Sample Data for Event Booking Platform
// Run these commands in MongoDB shell or use MongoDB Compass

// First, create sample users (organizers)
db.users.insertMany([
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "John Smith",
    email: "john.smith@techevents.com",
    password: "$2b$10$hashedpassword123", // This should be properly hashed
    role: "admin",
    phone: "+1-555-0101",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439012"),
    name: "Sarah Johnson",
    email: "sarah@bluenote.com",
    password: "$2b$10$hashedpassword456",
    role: "organizer",
    phone: "+1-555-0102",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439013"),
    name: "Mike Chen",
    email: "mike@mindfulliving.com",
    password: "$2b$10$hashedpassword789",
    role: "organizer",
    phone: "+1-555-0103",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439014"),
    name: "Lisa Rodriguez",
    email: "lisa@culinaryevents.com",
    password: "$2b$10$hashedpassword101",
    role: "organizer",
    phone: "+1-555-0104",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439015"),
    name: "David Wilson",
    email: "david@venturecapital.com",
    password: "$2b$10$hashedpassword112",
    role: "organizer",
    phone: "+1-555-0105",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  }
]);

// Then, create sample events
db.events.insertMany([
  {
    _id: ObjectId("507f1f77bcf86cd799439021"),
    title: "Tech Conference 2024",
    description: "Join us for the biggest tech conference of the year! Featuring keynote speakers, workshops, and networking opportunities with industry leaders.",
    organizer: ObjectId("507f1f77bcf86cd799439011"),
    category: "technology",
    location: {
      venue: "Convention Center",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      coordinates: {
        lat: 40.7505,
        lng: -73.9934
      }
    },
    dateTime: {
      start: new Date("2024-12-15T09:00:00.000Z"),
      end: new Date("2024-12-15T18:00:00.000Z")
    },
    capacity: 500,
    price: 299.99,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"],
    tags: ["technology", "conference", "networking", "workshops"],
    status: "published",
    isFeatured: true,
    bookedSeats: 0,
    availableSeats: 500,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439022"),
    title: "Jazz Night at Blue Note",
    description: "An evening of smooth jazz featuring local and international artists. Enjoy great music, cocktails, and a sophisticated atmosphere.",
    organizer: ObjectId("507f1f77bcf86cd799439012"),
    category: "music",
    location: {
      venue: "Blue Note Jazz Club",
      address: {
        street: "456 Jazz Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        country: "USA"
      },
      coordinates: {
        lat: 40.7295,
        lng: -73.9881
      }
    },
    dateTime: {
      start: new Date("2024-11-20T20:00:00.000Z"),
      end: new Date("2024-11-20T23:00:00.000Z")
    },
    capacity: 150,
    price: 75.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"],
    tags: ["jazz", "music", "live", "nightlife"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 150,
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439023"),
    title: "Yoga Retreat Weekend",
    description: "Escape the city for a rejuvenating yoga retreat. Includes meditation sessions, healthy meals, and peaceful nature walks.",
    organizer: ObjectId("507f1f77bcf86cd799439013"),
    category: "other",
    location: {
      venue: "Serenity Mountain Resort",
      address: {
        street: "789 Mountain Road",
        city: "Aspen",
        state: "CO",
        zipCode: "81611",
        country: "USA"
      },
      coordinates: {
        lat: 39.1911,
        lng: -106.8175
      }
    },
    dateTime: {
      start: new Date("2024-12-01T08:00:00.000Z"),
      end: new Date("2024-12-03T17:00:00.000Z")
    },
    capacity: 30,
    price: 450.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
    tags: ["yoga", "wellness", "retreat", "meditation"],
    status: "published",
    isFeatured: true,
    bookedSeats: 0,
    availableSeats: 30,
    createdAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439024"),
    title: "Food & Wine Festival",
    description: "A culinary celebration featuring top chefs, wine tastings, cooking demonstrations, and gourmet food samples from around the world.",
    organizer: ObjectId("507f1f77bcf86cd799439014"),
    category: "food",
    location: {
      venue: "Central Park",
      address: {
        street: "Central Park West",
        city: "New York",
        state: "NY",
        zipCode: "10024",
        country: "USA"
      },
      coordinates: {
        lat: 40.7829,
        lng: -73.9654
      }
    },
    dateTime: {
      start: new Date("2024-11-25T11:00:00.000Z"),
      end: new Date("2024-11-25T22:00:00.000Z")
    },
    capacity: 1000,
    price: 120.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
    tags: ["food", "wine", "culinary", "festival"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 1000,
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439025"),
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and discover the next big thing.",
    organizer: ObjectId("507f1f77bcf86cd799439015"),
    category: "business",
    location: {
      venue: "Innovation Hub",
      address: {
        street: "321 Startup Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA"
      },
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    dateTime: {
      start: new Date("2024-12-10T14:00:00.000Z"),
      end: new Date("2024-12-10T20:00:00.000Z")
    },
    capacity: 200,
    price: 50.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"],
    tags: ["startup", "pitch", "investors", "networking"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 200,
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439026"),
    title: "Comedy Night",
    description: "Laugh the night away with stand-up comedians from Comedy Central and Netflix specials. 21+ event with full bar service.",
    organizer: ObjectId("507f1f77bcf86cd799439012"),
    category: "other",
    location: {
      venue: "Laugh Factory",
      address: {
        street: "654 Comedy Lane",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90028",
        country: "USA"
      },
      coordinates: {
        lat: 34.1016,
        lng: -118.3267
      }
    },
    dateTime: {
      start: new Date("2024-11-30T19:30:00.000Z"),
      end: new Date("2024-11-30T22:30:00.000Z")
    },
    capacity: 300,
    price: 35.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800"],
    tags: ["comedy", "stand-up", "entertainment", "nightlife"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 300,
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-10-25")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439027"),
    title: "Marathon Training Workshop",
    description: "Get ready for your next marathon with expert training tips, nutrition advice, and running techniques from professional coaches.",
    organizer: ObjectId("507f1f77bcf86cd799439013"),
    category: "sports",
    location: {
      venue: "Sports Complex",
      address: {
        street: "987 Athletic Drive",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA"
      },
      coordinates: {
        lat: 42.3601,
        lng: -71.0589
      }
    },
    dateTime: {
      start: new Date("2024-12-05T09:00:00.000Z"),
      end: new Date("2024-12-05T16:00:00.000Z")
    },
    capacity: 100,
    price: 85.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"],
    tags: ["running", "marathon", "training", "fitness"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 100,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-01")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439028"),
    title: "Art Gallery Opening",
    description: "Exclusive opening night for contemporary art exhibition featuring emerging artists. Wine and cheese reception included.",
    organizer: ObjectId("507f1f77bcf86cd799439014"),
    category: "art",
    location: {
      venue: "Modern Art Gallery",
      address: {
        street: "147 Art District",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA"
      },
      coordinates: {
        lat: 25.7617,
        lng: -80.1918
      }
    },
    dateTime: {
      start: new Date("2024-11-28T18:00:00.000Z"),
      end: new Date("2024-11-28T21:00:00.000Z")
    },
    capacity: 150,
    price: 25.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"],
    tags: ["art", "gallery", "exhibition", "culture"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 150,
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-05")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439029"),
    title: "Blockchain & Crypto Summit",
    description: "Learn about the future of blockchain technology, cryptocurrency trends, and investment opportunities from industry experts.",
    organizer: ObjectId("507f1f77bcf86cd799439011"),
    category: "technology",
    location: {
      venue: "Tech Conference Center",
      address: {
        street: "555 Innovation Way",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        country: "USA"
      },
      coordinates: {
        lat: 30.2672,
        lng: -97.7431
      }
    },
    dateTime: {
      start: new Date("2024-12-12T10:00:00.000Z"),
      end: new Date("2024-12-12T18:00:00.000Z")
    },
    capacity: 400,
    price: 199.99,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"],
    tags: ["blockchain", "crypto", "technology", "investment"],
    status: "published",
    isFeatured: true,
    bookedSeats: 0,
    availableSeats: 400,
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-10")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439030"),
    title: "Family Fun Day",
    description: "A day of fun activities for the whole family including games, face painting, balloon animals, and live entertainment.",
    organizer: ObjectId("507f1f77bcf86cd799439015"),
    category: "other",
    location: {
      venue: "Community Park",
      address: {
        street: "321 Family Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA"
      },
      coordinates: {
        lat: 41.8781,
        lng: -87.6298
      }
    },
    dateTime: {
      start: new Date("2024-12-08T10:00:00.000Z"),
      end: new Date("2024-12-08T16:00:00.000Z")
    },
    capacity: 500,
    price: 15.00,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"],
    tags: ["family", "kids", "entertainment", "outdoor"],
    status: "published",
    isFeatured: false,
    bookedSeats: 0,
    availableSeats: 500,
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-15")
  }
]);

// Optional: Create some sample bookings
db.bookings.insertMany([
  {
    _id: ObjectId("507f1f77bcf86cd799439041"),
    user: ObjectId("507f1f77bcf86cd799439011"),
    event: ObjectId("507f1f77bcf86cd799439021"),
    numberOfTickets: 2,
    totalAmount: 599.98,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15")
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439042"),
    user: ObjectId("507f1f77bcf86cd799439012"),
    event: ObjectId("507f1f77bcf86cd799439023"),
    numberOfTickets: 1,
    totalAmount: 450.00,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20")
  }
]);

// Update event booked seats after creating bookings
db.events.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439021") },
  { $inc: { bookedSeats: 2 } }
);

db.events.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439023") },
  { $inc: { bookedSeats: 1 } }
); 