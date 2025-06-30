# EventHub - Event Booking Platform

A comprehensive event booking platform built with Next.js, featuring secure authentication, event management, real-time booking, and integrated payment processing with Stripe.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with user registration and login
- **Event Management**: Create, edit, and manage events with rich details
- **Event Discovery**: Browse events with advanced filtering and search
- **Real-time Booking**: Book tickets with real-time availability checking
- **Payment Integration**: Secure payment processing with Stripe
- **Dashboard**: Comprehensive dashboard for event organizers and attendees
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **State Management**: Efficient state management with Zustand
- **Database**: MongoDB with Mongoose for data persistence

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **State Management**: Zustand
- **Payment**: Stripe
- **UI Components**: Lucide React, Headless UI
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd event-booking-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/event-booking-platform

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Application Configuration
NODE_ENV=development
```

### 4. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Update the Stripe keys in your `.env.local` file

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── events/        # Event management endpoints
│   │   └── bookings/      # Booking endpoints
│   ├── dashboard/         # User dashboard
│   ├── events/            # Events listing and details
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── create-event/      # Event creation page
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── models/            # MongoDB models
│   ├── store.js           # Zustand stores
│   └── db.js              # Database connection
└── styles/                # Global styles
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events with filtering
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `GET /api/events/featured` - Get featured events

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking

## 🎨 Key Features

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- User session management

### Event Management
- Create and manage events
- Rich event details (title, description, location, date/time)
- Event categories and tags
- Image upload support
- Event status management (draft, published, cancelled)

### Booking System
- Real-time seat availability
- Secure payment processing
- Booking confirmation and tickets
- Booking history and management

### Dashboard
- Event organizer dashboard
- Booking analytics and statistics
- User profile management
- Event performance tracking

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] QR code tickets
- [ ] Event recommendations
- [ ] Social features (comments, reviews)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Stripe](https://stripe.com/) for payment processing
- [MongoDB](https://mongodb.com/) for the database
- [Zustand](https://github.com/pmndrs/zustand) for state management
