'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';
import FAQ from '@/components/faq/faq';
import ProtectedLink from '@/components/ProtectedLink';

export default function LandingPage() {
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    async function fetchFeaturedDoctors() {
      try {
        const response = await fetch('/api/doctors/public');
        if (response.ok) {
          const data = await response.json();
          // Get all doctors (should be 3) for featured section
          setFeaturedDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
    fetchFeaturedDoctors();
  }, []);

    return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 100 0 L 0 0 0 100\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"1\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100\" height=\"100\" fill=\"url(%23grid)\" /%3E%3C/svg%3E')"
          }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Thinking About Surgery but Need Clarity?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get a trusted second opinion from a board-certified specialist so you understand your options before making a decision.
          </p>
          <div className="flex justify-center items-center">
            <ProtectedLink
              href="/dashboard"
              className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get a Second Opinion
            </ProtectedLink>
          </div>
          <p className="mt-6 text-sm text-white/80">
            100% confidential. HIPAA compliant.
          </p>
        </div>
      </section>

      {/* Clarity Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 text-center mb-4">
            Here's the clarity you'll have after your second opinion.
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            You will walk away with one of these three answers.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* YES Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">YES</h3>
              <p className="text-gray-700 leading-relaxed">
                Surgery is the right next step. Now you can move forward confidently, understanding why and when.
              </p>
            </div>

            {/* NO Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">NO</h3>
              <p className="text-gray-700 leading-relaxed">
                Surgery isn't necessarily right now. You'll learn about conservative options that may help you avoid or delay surgery.
              </p>
            </div>

            {/* WHAT ELSE Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">WHAT ELSE?</h3>
              <p className="text-gray-700 leading-relaxed">
                You're not ready yet, but now you're informed. You'll have better questions to ask your doctor, or you can explore one of the specialists who reviewed your case.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board-Certified Specialists Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 text-center mb-4">
            Reviewed by Board-Certified Specialists
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our platform uses an AI/MD team to provide a prompt, unbiased, accurate, and comprehensive healthcare opinion. There are important reasons to choose our specialists.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Board-certified specialists</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Certified in 10+ conditions</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Academics & private practice experience</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Reviews completed in 24-48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Surgeons Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            Meet the Specialists Behind Your Second Opinion
          </h2>
          
          {featuredDoctors.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              {featuredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.slug}`}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:-translate-y-2"
                >
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {doctor.image ? (
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{doctor.name}</h3>
                  <p className="text-white/80 text-sm">{doctor.specialty}</p>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <ProtectedLink
              href="/dashboard"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Specialists
            </ProtectedLink>
          </div>
        </div>
      </section>

      {/* Why Specialists Believe Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 text-center mb-4">
            Why Our Specialists Believe Every Patient Deserves a Second Opinion
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Because nobody has the right to make a life-altering decision without understanding all of their options.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Featured Specialist</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  "Patients deserve an opportunity to consider all their surgical options (if any), treatment, and have appropriate or conservative treatment approach. I also have a belief that one should always seek the least invasive approach to care. The current healthcare system, unfortunately, is geared towards invasive options and surgery, which is not always the best option for patients."
                </p>
                <ProtectedLink href="/dashboard" className="text-purple-600 font-semibold hover:underline">
                  Learn More →
                </ProtectedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Functionality Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 text-center mb-4">
            Platform Functionality
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Comprehensive features to manage your doctor directory and optimize your online presence.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Functionality:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">Doctor Directory Management:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Add, edit, and manage comprehensive doctor profiles with specialties, locations, education, certifications, and contact information.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">SEO Optimization:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Complete control over meta tags, Open Graph, Twitter Cards, structured data, analytics integration, and sitemap settings for maximum search visibility.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">Analytics Dashboard:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Real-time insights with interactive charts showing doctor distribution by specialty, state-wise analytics, and comprehensive reporting tools.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">GoHighLevel Integration:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Seamlessly embed the doctor directory in GHL funnels using iframe widgets with full search, filter, and profile viewing capabilities.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center">
            <ProtectedLink
              href="/dashboard"
              className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get a Second Opinion
            </ProtectedLink>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer CTA */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Clarity changes everything.
          </h2>
          <div className="flex justify-center mb-8">
            <ProtectedLink
              href="/dashboard"
              className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get a Second Opinion
            </ProtectedLink>
          </div>
          <p className="text-white/80 text-sm">
            Copyright {new Date().getFullYear()} Doctor Directory. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-white/80 text-sm">
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </section>
      </div>
    );
}
