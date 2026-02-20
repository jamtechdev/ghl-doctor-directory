'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';

interface SEOSettings {
  directory: {
    title: string;
    description: string;
    keywords: string[];
    organization: {
      name: string;
      description: string;
      url: string;
    };
  };
}

export default function SEOSettingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [settings, setSettings] = useState<SEOSettings>({
    directory: {
      title: '',
      description: '',
      keywords: [],
      organization: {
        name: '',
        description: '',
        url: '',
      },
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchSettings();
      fetchDoctors();
    }
  }, [user, token]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/seo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setSuccess('SEO settings updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update SEO settings');
      }
    } catch (error) {
      setError('An error occurred while updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    setSettings({
      ...settings,
      directory: {
        ...settings.directory,
        keywords,
      },
    });
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  // Prepare data for graph (doctors by specialty)
  const specialtyData = doctors.reduce((acc: Record<string, number>, doctor) => {
    const specialty = doctor.specialty;
    acc[specialty] = (acc[specialty] || 0) + 1;
    return acc;
  }, {});

  const graphData = Object.entries(specialtyData).map(([specialty, count]) => ({
    specialty,
    count,
  })).sort((a, b) => b.count - a.count);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-gray-600 mt-2">Manage SEO metadata for the doctor directory</p>
        </div>

        {/* Graph - Doctors by Specialty */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Doctors by Specialty</h2>
          <div className="space-y-4">
            {graphData.length > 0 ? (
              graphData.map((item, index) => {
                const maxCount = Math.max(...graphData.map(d => d.count), 1);
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.specialty}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* SEO Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Directory Title *
              </label>
              <input
                type="text"
                value={settings.directory.title}
                onChange={(e) => setSettings({
                  ...settings,
                  directory: { ...settings.directory, title: e.target.value },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Directory Description *
              </label>
              <textarea
                value={settings.directory.description}
                onChange={(e) => setSettings({
                  ...settings,
                  directory: { ...settings.directory, description: e.target.value },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={settings.directory.keywords.join(', ')}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="doctor directory, find doctor, medical professionals"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={settings.directory.organization.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      directory: {
                        ...settings.directory,
                        organization: {
                          ...settings.directory.organization,
                          name: e.target.value,
                        },
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Description *
                  </label>
                  <textarea
                    value={settings.directory.organization.description}
                    onChange={(e) => setSettings({
                      ...settings,
                      directory: {
                        ...settings.directory,
                        organization: {
                          ...settings.directory.organization,
                          description: e.target.value,
                        },
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization URL *
                  </label>
                  <input
                    type="url"
                    value={settings.directory.organization.url}
                    onChange={(e) => setSettings({
                      ...settings,
                      directory: {
                        ...settings.directory,
                        organization: {
                          ...settings.directory.organization,
                          url: e.target.value,
                        },
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
          </div>

          {/* SEO Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Keywords</span>
                  <span className="text-lg font-bold text-blue-600">{settings.directory.keywords.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Title Length</span>
                  <span className={`text-lg font-bold ${settings.directory.title.length > 60 ? 'text-red-600' : 'text-green-600'}`}>
                    {settings.directory.title.length}/60
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Description Length</span>
                  <span className={`text-lg font-bold ${settings.directory.description.length > 160 ? 'text-red-600' : 'text-purple-600'}`}>
                    {settings.directory.description.length}/160
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Organization URL</span>
                  <span className={`text-sm font-bold ${settings.directory.organization.url ? 'text-green-600' : 'text-yellow-600'}`}>
                    {settings.directory.organization.url ? '✓ Set' : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
