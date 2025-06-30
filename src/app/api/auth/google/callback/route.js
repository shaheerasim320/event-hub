import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/login?error=google_oauth_failed');
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect('/login?error=google_token_failed');
  }

  // Get user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await userRes.json();

  if (!profile.email) {
    return NextResponse.redirect('/login?error=google_profile_failed');
  }

  await connectDB();
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    // If user with this Google ID doesn't exist, check by email
    user = await User.findOne({ email: profile.email });
    if (user) {
      // Link Google account
      user.googleId = profile.id;
      user.avatar = profile.picture || user.avatar;
      await user.save();
    } else {
      // Register new user
      user = await User.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.id,
        avatar: profile.picture,
        isVerified: true,
        password: Math.random().toString(36).slice(-8), // random password
      });
    }
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set cookie and redirect
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(`${origin}/dashboard`);
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
  return response;
} 