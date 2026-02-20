import { NextRequest, NextResponse } from 'next/server';
import { createDoctor, getPublicDoctors, getDoctorsByUserId } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    // If user is logged in
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // Admin can see all doctors, doctors can see all doctors too
        const { getAllDoctors } = await import('@/lib/db');
        const doctors = getAllDoctors();
        return NextResponse.json({ doctors }, { status: 200 });
      }
    }

    // Public endpoint - return all public doctors
    const doctors = getPublicDoctors();
    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Only admin can create doctors
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, specialty, specialties, location, conditions, bio, image, brandColor, contact, education, certifications, email, password } = body;

    // Validation
    if (!name || !specialty || !location || !bio || !email || !password) {
      return NextResponse.json(
        { error: 'Name, specialty, location, bio, email, and password are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/dr\.?\s*/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const doctor = createDoctor({
      slug: `dr-${slug}`,
      name,
      specialty,
      specialties: Array.isArray(specialties) ? specialties : [specialty],
      location,
      conditions: Array.isArray(conditions) ? conditions : [],
      bio,
      image,
      brandColor,
      contact,
      education,
      certifications,
      email,
      password,
    });

    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
