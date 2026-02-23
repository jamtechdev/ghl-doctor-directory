'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';

interface SEOSettings {
  directory: {
    title: string;
    description: string;
    keywords: string[];
    organization: {
      name: string;
      description: string;
      url: string;
      logo?: string;
      phone?: string;
      email?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
    };
    openGraph?: {
      enabled?: boolean;
      title?: string;
      description?: string;
      type?: string;
      image?: string;
      siteName?: string;
    };
    twitter?: {
      enabled?: boolean;
      card?: string;
      title?: string;
      description?: string;
      image?: string;
      site?: string;
      creator?: string;
    };
    robots?: {
      index?: boolean;
      follow?: boolean;
      noarchive?: boolean;
      nosnippet?: boolean;
      noimageindex?: boolean;
      maxSnippet?: number;
      maxImagePreview?: string;
      maxVideoPreview?: number;
    };
    canonicalUrl?: string;
    alternateLanguages?: string[];
    analytics?: {
      googleAnalyticsId?: string;
      googleTagManagerId?: string;
      facebookPixelId?: string;
      microsoftClarityId?: string;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    structuredData?: {
      enabled?: boolean;
      organizationSchema?: boolean;
      breadcrumbSchema?: boolean;
      websiteSchema?: boolean;
    };
    sitemap?: {
      enabled?: boolean;
      changefreq?: string;
      priority?: number;
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
  const [newKeyword, setNewKeyword] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
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

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.directory.keywords.includes(newKeyword.trim())) {
      setSettings({
        ...settings,
        directory: {
          ...settings.directory,
          keywords: [...settings.directory.keywords, newKeyword.trim()],
        },
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setSettings({
      ...settings,
      directory: {
        ...settings.directory,
        keywords: settings.directory.keywords.filter((_, i) => i !== index),
      },
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !(settings.directory.alternateLanguages || []).includes(newLanguage.trim())) {
      setSettings({
        ...settings,
        directory: {
          ...settings.directory,
          alternateLanguages: [...(settings.directory.alternateLanguages || []), newLanguage.trim()],
        },
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setSettings({
      ...settings,
      directory: {
        ...settings.directory,
        alternateLanguages: (settings.directory.alternateLanguages || []).filter((_, i) => i !== index),
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

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
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
          <p className="text-gray-600 mt-2">Manage comprehensive SEO metadata for the doctor directory</p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Basic SEO Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={settings.directory.title}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: { ...settings.directory, title: e.target.value },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="Doctor Directory - Find the Right Doctor"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {settings.directory.title.length}/60 characters (Recommended: 50-60)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  value={settings.directory.description}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: { ...settings.directory, description: e.target.value },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black resize-none"
                  rows={4}
                  placeholder="Search and filter through our comprehensive directory of qualified doctors..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {settings.directory.description.length}/160 characters (Recommended: 150-160)
                </p>
              </div>

              {/* Keywords Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords / Tags
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter keyword and press Enter or click Add"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {settings.directory.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {settings.directory.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Organization Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
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
                      organization: { ...settings.directory.organization, name: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description *
                </label>
                <textarea
                  value={settings.directory.organization.description}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      organization: { ...settings.directory.organization, description: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
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
                      organization: { ...settings.directory.organization, url: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.directory.organization.logo || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      organization: { ...settings.directory.organization, logo: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.directory.organization.phone || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      organization: { ...settings.directory.organization, phone: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.directory.organization.email || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      organization: { ...settings.directory.organization, email: e.target.value },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="contact@example.com"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={settings.directory.organization.address?.street || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          organization: {
                            ...settings.directory.organization,
                            address: {
                              ...settings.directory.organization.address,
                              street: e.target.value,
                            },
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={settings.directory.organization.address?.city || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          organization: {
                            ...settings.directory.organization,
                            address: {
                              ...settings.directory.organization.address,
                              city: e.target.value,
                            },
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={settings.directory.organization.address?.state || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          organization: {
                            ...settings.directory.organization,
                            address: {
                              ...settings.directory.organization.address,
                              state: e.target.value,
                            },
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      value={settings.directory.organization.address?.zipCode || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          organization: {
                            ...settings.directory.organization,
                            address: {
                              ...settings.directory.organization.address,
                              zipCode: e.target.value,
                            },
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={settings.directory.organization.address?.country || 'USA'}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          organization: {
                            ...settings.directory.organization,
                            address: {
                              ...settings.directory.organization.address,
                              country: e.target.value,
                            },
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Open Graph Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ogEnabled"
                  checked={settings.directory.openGraph?.enabled || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      openGraph: {
                        ...settings.directory.openGraph,
                        enabled: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="ogEnabled" className="text-sm font-medium text-gray-700">
                  Enable Open Graph Tags
                </label>
              </div>

              {settings.directory.openGraph?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 border-l-2 border-blue-200">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                    <input
                      type="text"
                      value={settings.directory.openGraph?.title || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          openGraph: {
                            ...settings.directory.openGraph,
                            title: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
                    <textarea
                      value={settings.directory.openGraph?.description || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          openGraph: {
                            ...settings.directory.openGraph,
                            description: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Type</label>
                    <select
                      value={settings.directory.openGraph?.type || 'website'}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          openGraph: {
                            ...settings.directory.openGraph,
                            type: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="profile">Profile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.directory.openGraph?.siteName || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          openGraph: {
                            ...settings.directory.openGraph,
                            siteName: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                    <input
                      type="url"
                      value={settings.directory.openGraph?.image || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          openGraph: {
                            ...settings.directory.openGraph,
                            image: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Twitter Card Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Twitter Card Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="twitterEnabled"
                  checked={settings.directory.twitter?.enabled || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      twitter: {
                        ...settings.directory.twitter,
                        enabled: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="twitterEnabled" className="text-sm font-medium text-gray-700">
                  Enable Twitter Cards
                </label>
              </div>

              {settings.directory.twitter?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 border-l-2 border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                    <select
                      value={settings.directory.twitter?.card || 'summary_large_image'}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          twitter: {
                            ...settings.directory.twitter,
                            card: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Site</label>
                    <input
                      type="text"
                      value={settings.directory.twitter?.site || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          twitter: {
                            ...settings.directory.twitter,
                            site: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Creator</label>
                    <input
                      type="text"
                      value={settings.directory.twitter?.creator || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          twitter: {
                            ...settings.directory.twitter,
                            creator: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="@username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Image URL</label>
                    <input
                      type="url"
                      value={settings.directory.twitter?.image || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          twitter: {
                            ...settings.directory.twitter,
                            image: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Robots & Indexing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Robots & Indexing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="robotsIndex"
                  checked={settings.directory.robots?.index !== false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      robots: {
                        ...settings.directory.robots,
                        index: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="robotsIndex" className="text-sm font-medium text-gray-700">
                  Allow Indexing
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="robotsFollow"
                  checked={settings.directory.robots?.follow !== false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      robots: {
                        ...settings.directory.robots,
                        follow: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="robotsFollow" className="text-sm font-medium text-gray-700">
                  Allow Following Links
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="robotsNoArchive"
                  checked={settings.directory.robots?.noarchive || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      robots: {
                        ...settings.directory.robots,
                        noarchive: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="robotsNoArchive" className="text-sm font-medium text-gray-700">
                  No Archive
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="robotsNoSnippet"
                  checked={settings.directory.robots?.nosnippet || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      robots: {
                        ...settings.directory.robots,
                        nosnippet: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="robotsNoSnippet" className="text-sm font-medium text-gray-700">
                  No Snippet
                </label>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Analytics & Tracking</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={settings.directory.analytics?.googleAnalyticsId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      analytics: {
                        ...settings.directory.analytics,
                        googleAnalyticsId: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager ID</label>
                <input
                  type="text"
                  value={settings.directory.analytics?.googleTagManagerId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      analytics: {
                        ...settings.directory.analytics,
                        googleTagManagerId: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={settings.directory.analytics?.facebookPixelId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      analytics: {
                        ...settings.directory.analytics,
                        facebookPixelId: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="123456789012345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Microsoft Clarity ID</label>
                <input
                  type="text"
                  value={settings.directory.analytics?.microsoftClarityId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      analytics: {
                        ...settings.directory.analytics,
                        microsoftClarityId: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="xxxxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.directory.socialMedia?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      socialMedia: {
                        ...settings.directory.socialMedia,
                        facebook: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={settings.directory.socialMedia?.twitter || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      socialMedia: {
                        ...settings.directory.socialMedia,
                        twitter: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={settings.directory.socialMedia?.linkedin || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      socialMedia: {
                        ...settings.directory.socialMedia,
                        linkedin: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.directory.socialMedia?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      socialMedia: {
                        ...settings.directory.socialMedia,
                        instagram: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={settings.directory.socialMedia?.youtube || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      socialMedia: {
                        ...settings.directory.socialMedia,
                        youtube: e.target.value,
                      },
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </div>

          {/* Structured Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Structured Data (Schema.org)</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="structuredDataEnabled"
                  checked={settings.directory.structuredData?.enabled !== false}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: {
                      ...settings.directory,
                      structuredData: {
                        ...settings.directory.structuredData,
                        enabled: e.target.checked,
                      },
                    },
                  })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="structuredDataEnabled" className="text-sm font-medium text-gray-700">
                  Enable Structured Data
                </label>
              </div>

              {settings.directory.structuredData?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-8 border-l-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="orgSchema"
                      checked={settings.directory.structuredData?.organizationSchema !== false}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          structuredData: {
                            ...settings.directory.structuredData,
                            organizationSchema: e.target.checked,
                          },
                        },
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="orgSchema" className="text-sm font-medium text-gray-700">
                      Organization Schema
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="breadcrumbSchema"
                      checked={settings.directory.structuredData?.breadcrumbSchema !== false}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          structuredData: {
                            ...settings.directory.structuredData,
                            breadcrumbSchema: e.target.checked,
                          },
                        },
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="breadcrumbSchema" className="text-sm font-medium text-gray-700">
                      Breadcrumb Schema
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="websiteSchema"
                      checked={settings.directory.structuredData?.websiteSchema !== false}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          structuredData: {
                            ...settings.directory.structuredData,
                            websiteSchema: e.target.checked,
                          },
                        },
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="websiteSchema" className="text-sm font-medium text-gray-700">
                      Website Schema
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">Additional Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                <input
                  type="url"
                  value={settings.directory.canonicalUrl || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    directory: { ...settings.directory, canonicalUrl: e.target.value },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  placeholder="https://example.com"
                />
              </div>

              {/* Alternate Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Languages</label>
                <div className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addLanguage();
                        }
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                      placeholder="Enter language code (e.g., es, fr, de)"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {(settings.directory.alternateLanguages || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(settings.directory.alternateLanguages || []).map((lang, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-200"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sitemap Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sitemap Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sitemapEnabled"
                      checked={settings.directory.sitemap?.enabled !== false}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          sitemap: {
                            ...settings.directory.sitemap,
                            enabled: e.target.checked,
                          },
                        },
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sitemapEnabled" className="text-sm font-medium text-gray-700">
                      Enable Sitemap
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Frequency</label>
                    <select
                      value={settings.directory.sitemap?.changefreq || 'weekly'}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          sitemap: {
                            ...settings.directory.sitemap,
                            changefreq: e.target.value,
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority (0.0 - 1.0)</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.directory.sitemap?.priority || 0.8}
                      onChange={(e) => setSettings({
                        ...settings,
                        directory: {
                          ...settings.directory,
                          sitemap: {
                            ...settings.directory.sitemap,
                            priority: parseFloat(e.target.value),
                          },
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 flex-wrap">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-center sm-w-full"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm-w-full"
            >
              {saving ? 'Saving...' : 'Save All SEO Settings'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
