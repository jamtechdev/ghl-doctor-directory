/**
 * Authentication middleware for admin role checking
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/db';

/**
 * Verifies that the request has a valid admin token
 * Returns the decoded token if valid, null otherwise
 */
export function requireAdmin(request: NextRequest): { userId: string; email: string; role: string } | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Get user from database to verify role (role in token might be outdated)
  const user = getUserById(decoded.userId);
  if (!user || user.role !== 'admin') {
    return null;
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: user.role,
  };
}

/**
 * Verifies that the request has a valid token (any user)
 * Returns the decoded token if valid, null otherwise
 */
export function requireAuth(request: NextRequest): { userId: string; email: string; role?: string } | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Get user from database to get current role
  const user = getUserById(decoded.userId);
  if (!user) {
    return null;
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: user.role,
  };
}
