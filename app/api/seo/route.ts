import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const seoSettingsPath = path.join(dataDir, 'seo-settings.json');

function getSEOSettings() {
  if (!fs.existsSync(seoSettingsPath)) {
    // Return default settings if file doesn't exist
    return {
      directory: {
        title: "Doctor Directory - Find the Right Doctor for Your Needs",
        description: "Search and filter through our comprehensive directory of qualified doctors.",
        keywords: ["doctor directory", "find doctor", "medical professionals"],
        organization: {
          name: "Doctor Directory",
          description: "Find qualified doctors and specialists.",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
        },
      },
    };
  }
  const data = fs.readFileSync(seoSettingsPath, 'utf-8');
  return JSON.parse(data);
}

function saveSEOSettings(settings: any) {
  fs.writeFileSync(seoSettingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
  try {
    const settings = getSEOSettings();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require admin role
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings are required' },
        { status: 400 }
      );
    }

    saveSEOSettings(settings);
    return NextResponse.json({ message: 'SEO settings updated successfully', settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
