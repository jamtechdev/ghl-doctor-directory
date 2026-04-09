import { NextResponse } from 'next/server';
import { checkDbHealth } from '@/lib/db';

export async function GET() {
  const health = await checkDbHealth();
  const status = health.ok ? 200 : 503;

  return NextResponse.json(
    {
      status: health.ok ? 'ok' : 'error',
      database: 'mysql',
      message: health.message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
