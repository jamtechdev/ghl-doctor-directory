'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';
import Navbar from '@/components/navbar/Navbar';
import FAQ from '@/components/faq/faq';
import ProtectedLink from '@/components/ProtectedLink';


import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import Footer from '@/components/footer/Footer';
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

   const testimonials = [
    {
      name: 'Joseph A. Rosenbaum, MD',
      image: 'images/review1.png',
      rating: 5,
      text: 'Patients deserve an opportunity for a second opinion because surgeons differ in training, experience, and how aggressively or conservatively they approach treatment. Often there is more than one reasonable option, and the best choice depends on both the medical details and patients goals. I believe in clearly explaining those options and helping patients choose a thoughtful evidence-based plan tailored to them.',
    },
    {
      name: 'David Luo, MD',
      image: 'images/review2.png',
      rating: 4,
      text: 'Second opinions ensure informed decisions, personalized care, and the best possible outcome for each patient. Doctor Directory provides a never-before-seen platform that empowers patients to seek the care they deserve.',
    },
    {
      name: 'Bo Nasmyth Loy, MD, FAAOS',
      image: 'images/review3.png',
      rating: 5,
      text: 'I believe patients make better decisions when they truly understand their options. As a board-certified, fellowship-trained orthopaedic surgeon with experience caring for professional athletes, I take the time to explain those choices in a way that’s straightforward and personalized. My goal is for patients to feel confident and comfortable with their decisions, so they can move forward with clarity and peace of mind. ',
    },
  ];


  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="relative min-h-[100vh] flex items-center overflow-hidden mt-24">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/images/bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark Gradient Overlay to make text pop */}
          <div className="absolute inset-0 bg-black/50 lg:bg-gradient-to-r lg:from-black/70 lg:to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* Heading - Increased weight and line-height */}
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-snug md:leading-relaxed mb-6 line-height-6">
              Thinking About Surgery but Need
              Clarity?
            </h1>

            {/* Description - Added a slight opacity for that premium feel */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
              Get a <span className="font-semibold text-white">trusted second opinion</span> from a board-certified orthopedic specialist so you understand your options before making a decision.
            </p>

            {/* Trust Badges / Small Text */}
            <div className="mt-8 flex flex-col gap-1">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                ✓ Board certified orthopedic specialists.
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                ✓ Secure case review. Clear recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Clarity Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl  font-semibold text-black leading-tight mb-2 text-center text-[40px] line-height-5">
            Here’s the clarity you’ll have after your<br /> second <span className='text-primary'>opinion.</span>
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            You will walk away with one of these three answers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8 mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl  duration-300 hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center ">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">YES</h3>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">Surgery is the right next step</h3>
              <p className="text-gray-600">And you can move forward confidently, understanding why and when.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl  duration-300 hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center ">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">NO</h3>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">Surgery isn’t necessary right now</h3>
              <p className="text-gray-600">You’ll learn about conservative options that may help you avoid or delay surgery.</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl  duration-300 hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center ">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 ">WHAT ELSE?</h3>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">You’re not ready yet, but now you’re informed</h3>
              <p className="text-gray-600">You’ll have better questions to ask your doctor, or you can continue care with the specialist who reviewed your case.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Board-Certified Specialists Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-[40px] font-bold text-black text-center mb-4">
            Reviewed by Board-Certified Specialists
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our platform uses an AI/MD team to provide a prompt, unbiased, accurate, and comprehensive healthcare opinion. There are important reasons to choose our specialists.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white rounded-xl p-6  transition shadow-lg  cursor-pointer border duration-300 hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center p-2">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-normal text-gray-900 mb-2 text-gray-200 text-center">Board-certified
                orthopedic surgeons</h3>
            </div>

            <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center p-2">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-normal text-gray-900 mb-2 text-gray-200 text-center">Specialists experienced in
                110+ orthopedic conditions</h3>
            </div>

            <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center  p-2">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-normal text-gray-900 mb-2 text-gray-200 text-center">Academic + private
                practice experience</h3>
            </div>

            <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center  p-2">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-normal text-gray-900 mb-2 text-gray-200 text-center">Reviews completed in
                24–48 hours</h3>
            </div>
          </div>
        </div>
      </section>

      

      {/* Meet the Surgeons Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-4xl  font-bold text-white text-center mb-8 text-[40px] line-height-5">
            Meet the Specialists Behind Your <br/> Second Opinion
          </h2>

          {featuredDoctors.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {featuredDoctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.slug}`}
                  className="bg-white/10 border shadow backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:-translate-y-2"
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
                  <h3 className=" font-semibold text-lg mb-1 text-white">{doctor.name}</h3>
                  <p className="text-white text-sm">{doctor.specialty}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/auth/login"
              className="w-full bg-white text-primary px-8 py-4 rounded-full font-semibold duration-300 transition hover:-translate-y-[12px] mt-8"
            >
              Login
            </Link>
          </div>
        </div>
      </section>


      {/* Why Specialists Believe Section */}
       <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            
             <h2 className="text-4xl  font-bold text-black text-center mb-4 text-[40px] line-height-5">
            Why Our Specialists Believe Every Patient<br/> Deserves a <span className='text-primary'>Second Opinion</span> 
          </h2>
                <p className="text-xl text-gray-600 text-center mb-12">
            Because nobody has the right to make a life-altering decision without understanding all of their options.
          </p>

            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className='swiper2'
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white p-8 rounded-xl shadow-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.text}</p>

                    <div className="text-yellow-500 font-semibold">
                      {item.rating} ★★★★★
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-12">
              <Link
                href="/auth/login"
                className="px-8  py-4 bg-primary hover:bg-purple-700 text-white rounded-full font-bold text-center  shadow-lg  mx-auto mt-5  duration-300 hover:-translate-y-[8px]"
              >
                Login
              </Link>
            </div>

          </div>

        </section>

      

      {/* Platform Functionality Section */}
      <section className="py-20 px-6 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl  font-bold text-black text-center mb-4 text-[40px] line-height-5">
            Platform Functionality
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Comprehensive features to manage your doctor directory and optimize your online presence.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Functionality:</h3>
            <ul className="space-y-4">
              <li className="flex items-start items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">Doctor Directory Management:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Add, edit, and manage comprehensive doctor profiles with specialties, locations, education, certifications, and contact information.</p>
                </div>
              </li>
              <li className="flex items-start items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">SEO Optimization:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Complete control over meta tags, Open Graph, Twitter Cards, structured data, analytics integration, and sitemap settings for maximum search visibility.</p>
                </div>
              </li>
              <li className="flex items-start items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <strong className="text-gray-900 text-lg">Analytics Dashboard:</strong>
                  <p className="text-gray-700 leading-relaxed mt-1">Real-time insights with interactive charts showing doctor distribution by specialty, state-wise analytics, and comprehensive reporting tools.</p>
                </div>
              </li>
              <li className="flex items-start items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="flex justify-center mt-12">
            <Link
              href="/auth/login"
              className=" bg-[#8b5cf6] text-white px-8 py-3 rounded-full font-semibold duration-300 transition hover:-translate-y-[12px]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <FAQ />

      

      {/* Footer CTA */}
      <section className="relative py-12 px-6 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl  font-bold text-[40px] text-white mb-8">
            Clarity changes everything.
          </h2>
          <div className="flex justify-center mb-8">
            <Link
              href="/auth/login"
              className=" bg-white text-primary px-8 py-3 rounded-full font-semibold duration-300 transition hover:-translate-y-[12px]"
            >
              Login
            </Link>
          </div>
          <p className="text-xl text-white text-center  max-w-3xl mx-auto">
            Copyright {new Date().getFullYear()} Doctor Directory. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-white text-sm text-xl text-[18px] text-white text-center  max-w-3xl mx-auto">
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <span>|</span>
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </section>

      {/* <Footer/> */}
    </div>
  );
}
