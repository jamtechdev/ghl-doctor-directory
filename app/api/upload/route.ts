import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `doctor-${timestamp}-${randomString}.${extension}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'images', 'doctors');
    await mkdir(uploadDir, { recursive: true });

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);

    try {
      await writeFile(filepath, buffer);
      console.log(`Image saved successfully: ${filepath}`);
    } catch (writeError: any) {
      console.error('Error writing file:', writeError);
      // On Render and similar platforms, the filesystem is ephemeral
      // Files will be lost on restart/redeploy. Consider using cloud storage.
      throw new Error(`Failed to save image: ${writeError.message}. Note: On cloud platforms like Render, filesystem is ephemeral. Consider using cloud storage (AWS S3, Cloudinary, etc.) for persistent image storage.`);
    }

    // Generate URL - prefer relative URL for Next.js, but also provide absolute URL
    // Use environment variable if available, otherwise construct from request
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    let fullUrl: string;
    const relativeUrl = `/images/doctors/${filename}`;
    
    try {
      const requestUrl = new URL(request.url);
      const protocol = requestUrl.protocol;
      const host = requestUrl.host;

      if (siteUrl) {
        // Use environment variable if set (recommended for production)
        fullUrl = `${siteUrl.replace(/\/$/, '')}${relativeUrl}`;
      } else if (host) {
        // Construct from request URL
        fullUrl = `${protocol}//${host}${relativeUrl}`;
      } else {
        // Fallback to relative URL (Next.js will resolve it)
        fullUrl = relativeUrl;
      }
    } catch (urlError) {
      // If URL parsing fails, use relative URL
      console.warn('Failed to parse request URL, using relative URL:', urlError);
      fullUrl = relativeUrl;
    }

    console.log(`Image upload successful. URL: ${fullUrl}, Relative: ${relativeUrl}`);

    return NextResponse.json(
      { url: fullUrl, relativeUrl, filename },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}
