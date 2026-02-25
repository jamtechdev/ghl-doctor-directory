import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getGHLConfig, saveGHLConfig } from '@/lib/ghl';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Only admin can view GHL config
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const config = getGHLConfig();
    // Don't return the full API key for security
    return NextResponse.json({
      enabled: config.enabled || false,
      locationId: config.locationId || '',
      hasApiKey: !!config.apiKey,
    });
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

    // Only admin can update GHL config
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { apiKey, locationId, enabled } = body;

    const currentConfig = getGHLConfig();
    const newConfig = {
      apiKey: apiKey || currentConfig.apiKey,
      locationId: locationId || currentConfig.locationId,
      enabled: enabled !== undefined ? enabled : currentConfig.enabled,
    };

    saveGHLConfig(newConfig);

    return NextResponse.json({ 
      message: 'GHL configuration saved successfully',
      enabled: newConfig.enabled,
      locationId: newConfig.locationId,
      hasApiKey: !!newConfig.apiKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
