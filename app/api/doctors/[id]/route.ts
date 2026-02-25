import { NextRequest, NextResponse } from 'next/server';
import { getDoctorById, updateDoctor, deleteDoctor } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { syncDoctorToGHL, deleteDoctorFromGHL } from '@/lib/ghl';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Public endpoint - anyone can view doctor details
    const resolvedParams = await Promise.resolve(params);
    const doctor = getDoctorById(resolvedParams.id);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ doctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const doctor = getDoctorById(resolvedParams.id);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Only admin can edit doctors
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, specialty, specialties, location, conditions, bio, image, brandColor, contact, education, certifications } = body;

    if (!name || !specialty || !location || !bio) {
      return NextResponse.json(
        { error: 'Name, specialty, location, and bio are required' },
        { status: 400 }
      );
    }

    const updatedDoctor = updateDoctor(resolvedParams.id, {
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
    });

    if (!updatedDoctor) {
      return NextResponse.json(
        { error: 'Failed to update doctor' },
        { status: 500 }
      );
    }

    // Sync to GoHighLevel (non-blocking)
    syncDoctorToGHL(updatedDoctor).catch(error => {
      console.error('Failed to sync doctor to GHL:', error);
    });

    return NextResponse.json({ doctor: updatedDoctor }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const doctor = getDoctorById(resolvedParams.id);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Only admin can delete doctors
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Sync deletion to GoHighLevel (non-blocking)
    deleteDoctorFromGHL(doctor).catch(error => {
      console.error('Failed to delete doctor from GHL:', error);
    });

    const success = deleteDoctor(resolvedParams.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete doctor' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Doctor deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
