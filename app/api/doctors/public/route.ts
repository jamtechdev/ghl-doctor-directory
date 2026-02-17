import { NextResponse } from 'next/server';
import { getPublicDoctors } from '@/lib/db';

export async function GET() {
  try {
    const doctors = getPublicDoctors();
    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
