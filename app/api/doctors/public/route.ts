import { NextResponse } from 'next/server';
import { getPublicDoctors } from '@/lib/db';

export async function GET() {
  try {
    const doctors = getPublicDoctors();
    return NextResponse.json(
      { doctors },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
