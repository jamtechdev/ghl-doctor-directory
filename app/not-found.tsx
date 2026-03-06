'use client';

import Link from 'next/link';
import PublicLayout from '@/components/PublicLayout';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
            >
              Back to Home
            </Link>
            <Link
              href="/directory"
              className="inline-block px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-semibold"
            >
              View Directory
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
