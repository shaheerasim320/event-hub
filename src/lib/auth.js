import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get user from token
export async function getUserFromToken(token) {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();
    
    const user = await User.findById(decoded.userId).select('-password');
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Check if user is admin
export function isAdmin(user) {
  return user && user.role === 'admin';
}

// Check if user is organizer or admin
export function isOrganizer(user) {
  return user && (user.role === 'organizer' || user.role === 'admin');
} 