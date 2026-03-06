import { NextResponse } from 'next/server';
import { getPublicDoctors, getAllDoctors } from '@/lib/db';

export async function GET() {
  try {
    // Get all doctors with role='doctor'
    const doctors = getPublicDoctors();
    
    // Debug logging (remove in production if needed)
    console.log('=== PUBLIC DOCTORS API ===');
    console.log('Total doctors found:', doctors.length);
    console.log('Doctor names:', doctors.map(d => d.name));
    console.log('Doctor IDs:', doctors.map(d => ({ id: d.id, email: d.contact?.email, role: 'doctor' })));
    
    // Ensure we return all doctors - no filtering or limiting
    return NextResponse.json(
      { doctors: doctors || [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error in public doctors API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
