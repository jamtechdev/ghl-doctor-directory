'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GHLIntegrationPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [siteUrl, setSiteUrl] = useState('');
  const [copied, setCopied] = useState('');
  const [ghlConfig, setGhlConfig] = useState({
    enabled: false,
    locationId: '',
    hasApiKey: false,
  });
  const [apiKey, setApiKey] = useState('');
  const [locationId, setLocationId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
    // Get the site URL: prefer env (production) so embed code is correct when deployed
    if (typeof window !== 'undefined') {
      const url = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      setSiteUrl(url);
    }
    // Load GHL config if admin
    if (user && token && user.role === 'admin') {
      fetchGHLConfig();
    }
  }, [user, token, authLoading, router]);

  const fetchGHLConfig = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch('/api/ghl/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGhlConfig(data);
        setLocationId(data.locationId || '');
        setEnabled(data.enabled || false);
      }
    } catch (error) {
      console.error('Error fetching GHL config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/ghl/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          apiKey: apiKey || undefined,
          locationId,
          enabled,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'GHL configuration saved successfully!' });
        setGhlConfig(data);
        setApiKey(''); // Clear API key field after saving
        fetchGHLConfig();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
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

  const embedUrl = `${siteUrl}/embed`;
  const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none;"
  title="Doctor Directory"
></iframe>`;

  const responsiveIframeCode = `<div style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="${embedUrl}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Doctor Directory"
    allowfullscreen
  ></iframe>
</div>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GoHighLevel Integration</h1>
          <p className="text-gray-600">
            Embed your doctor directory in GHL funnels and optionally sync doctors as contacts. Follow the two steps below.
          </p>
        </div>

        {/* Quick checklist */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
            Embed directory (required)
          </h2>
          <p className="text-sm text-gray-700 mb-2">Copy the responsive iframe below → In GHL funnel add Custom HTML block → Paste code → Save & preview.</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 mt-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">2</span>
            Sync doctors as contacts (optional)
          </h2>
          <p className="text-sm text-gray-700">Add your GHL API key and Location ID below and enable sync so create/update/delete here updates GHL contacts.</p>
        </div>

        {/* Step 1: Embed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
            Embed the directory in your funnel
          </h2>

        {/* Embed URL Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Embed URL</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={embedUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(embedUrl, 'url')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              {copied === 'url' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Basic Iframe Code */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Iframe Code</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Use this code in GoHighLevel's Custom HTML block or iframe widget
          </p>
          <div className="relative">
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{iframeCode}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(iframeCode, 'basic')}
              className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              {copied === 'basic' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Responsive Iframe Code */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Iframe Code (Recommended)</h3>
          <p className="text-gray-600 mb-4 text-sm">
            This code automatically adjusts to different screen sizes for better mobile experience
          </p>
          <div className="relative">
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
              <code>{responsiveIframeCode}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(responsiveIframeCode, 'responsive')}
              className="absolute top-2 right-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              {copied === 'responsive' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to add in GoHighLevel
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>In your GHL Funnel:</strong> Navigate to the page where you want to embed the directory
            </li>
            <li>
              <strong>Add a Custom HTML Block:</strong> Click "Add Element" → "Custom HTML" or "Code Block"
            </li>
            <li>
              <strong>Paste the iframe code:</strong> Copy one of the iframe codes above and paste it into the HTML block
            </li>
            <li>
              <strong>Adjust height (optional):</strong> Change the <code className="bg-gray-200 px-1 rounded">height="800"</code> value to fit your needs
            </li>
            <li>
              <strong>Save and Preview:</strong> Save your changes and preview the funnel to see the directory embedded
            </li>
          </ol>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What visitors get in the embed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Full Search Functionality</h3>
                <p className="text-sm text-gray-600">Search by name, specialty, or condition</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Filter by Specialty & Location</h3>
                <p className="text-sm text-gray-600">Filter doctors by specialty and state</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Complete Doctor Profiles</h3>
                <p className="text-sm text-gray-600">View full profiles with education, certifications, and contact info</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900">Mobile Responsive</h3>
                <p className="text-sm text-gray-600">Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Link */}
        <div className="mt-6 text-center">
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Preview Embed Page
          </a>
        </div>
        </div>

        {/* Step 2: Sync doctors as contacts - Admin Only */}
        {user?.role === 'admin' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">2</span>
              Sync doctors as GHL contacts (optional)
            </h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-4">
                When enabled, every doctor you create, update, or delete here will sync to GoHighLevel as a contact (same location). You need an API key and Location ID from GHL.
              </p>
              {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={ghlConfig.hasApiKey ? 'API key is set (leave blank to keep current)' : 'Enter your GHL API key'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">GoHighLevel → Settings → Integrations → API Keys</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location ID</label>
                  <input
                    type="text"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    placeholder="Enter your GHL Location ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">GoHighLevel → Settings → Locations</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                    Enable automatic syncing to GoHighLevel
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save configuration'}
                  </button>
                  {ghlConfig.enabled && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Syncing enabled
                    </span>
                  )}
                </div>
              </form>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">What syncs</h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>New doctor → new contact in GHL</li>
                  <li>Updated doctor → contact updated in GHL</li>
                  <li>Deleted doctor → contact removed from GHL</li>
                  <li>Specialty and custom fields are mapped to the contact</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
