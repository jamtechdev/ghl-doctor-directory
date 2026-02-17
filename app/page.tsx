'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import Footer from '@/components/footer/Footer';
import FAQ from '@/components/faq/faq';
export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        // Don't redirect, show landing page
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      text: 'Second opinions ensure informed decisions, personalized care, and the best possible outcome for each patient. XPRT2ND provides a never-before-seen platform that empowers patients to seek the care they deserve.',
    },
    {
      name: 'Bo Nasmyth Loy, MD, FAAOS',
      image: 'images/review3.png',
      rating: 5,
      text: 'I believe patients make better decisions when they truly understand their options. As a board-certified, fellowship-trained orthopaedic surgeon with experience caring for professional athletes, I take the time to explain those choices in a way that’s straightforward and personalized. My goal is for patients to feel confident and comfortable with their decisions, so they can move forward with clarity and peace of mind. ',
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative min-h-[100vh] flex items-center overflow-hidden">
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
              <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight mb-6">
                Thinking About Surgery but Need
                <span className="text-blue-400 text-primary"> Clarity?</span>
              </h1>

              {/* Description - Added a slight opacity for that premium feel */}
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
                Get a <span className="font-semibold text-white">trusted second opinion</span> from a board-certified orthopedic specialist so you understand your options before making a decision.
              </p>

              {/* Buttons - Rounded & Distinctive */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/get-started"
                  className="px-8 py-4 bg-primary hover:bg-purple-700 text-white rounded-full font-bold text-center transition-all shadow-lg"
                >
                 Login
                </Link>
                <Link
                  href="/start-case"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-full font-bold text-center transition-all"
                >
                  Get Started
                </Link>
              </div>

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

        {/* Expert Guidance */}
        {/* <div className="exper-guidance">
          <div className="max-w-7xl">
            <div className="content">
                <h1 className="text-3xl md:text-5xl font-semibold text-black leading-tight mb-6">
                Thinking About Surgery but Need
                <span className="text-blue-400 text-primary"> Clarity?</span>
              </h1>
            </div>
          </div>
        </div> */}


        {/* Second Opinion Section */}

        <div className="second-opinion">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="content">
              <h1 className="text-3xl md:text-5xl font-semibold text-black leading-tight mb-2">
                Here’s the clarity you’ll have after your<br /> second <span className='text-primary'>opinion.</span>
              </h1>
              <p className='text-base text-gray-600 text:sm'>You will walk away with one of three clear answers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[lab(45%_45.6_-57.58_/0.13)] rounded-lg flex items-center justify-center p-2">
                    <img src="/images/correct.png" alt="" className='w-20' />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">YES</h3>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">Surgery is the right next step</h3>
                <p className="text-gray-600">And you can move forward confidently, understanding why and when.</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[lab(45%_45.6_-57.58_/0.13)] rounded-lg flex items-center justify-center p-2">
                    <img src="/images/wrong.png" alt="" className='w-20' />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">NO</h3>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">Surgery isn’t necessary right now</h3>
                <p className="text-gray-600">You’ll learn about conservative options that may help you avoid or delay surgery.</p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[lab(45%_45.6_-57.58_/0.13)] rounded-lg flex items-center justify-center  p-2">
                    <img src="/images/else.png" alt="" className='w-20' />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 ">WHAT ELSE?</h3>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary">You’re not ready yet, but now you’re informed</h3>
                <p className="text-gray-600">You’ll have better questions to ask your doctor, or you can continue care with the specialist who reviewed your case.</p>
              </div>
            </div>
          </div>
        </div>




        {/* Reviewed Section */}
        <div className="second-opinion mb-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="content">
              <h1 className="text-3xl md:text-5xl font-semibold text-black leading-tight mb-2">
                <span className='text-primary'>Reviewed by </span>
                Board-Certified <br /> Orthopedic Specialists
              </h1>
              <p className='text-base text-gray-600 text:sm'>Every case on XPRT2ND is reviewed by a board-certified orthopedic specialist with real experience treating complex conditions. These are surgeons chosen for judgment, not volume.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center p-2">
                    <img src="/images/certified.png" alt="" className='w-20' />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary text-center">Board-certified
                  orthopedic surgeons</h3>
              </div>

              <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center p-2">
                    <img src="/images/dashbord.png" alt="" className='w-20' />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary text-center">Specialists experienced in
                  110+ orthopedic conditions</h3>
              </div>

              <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center  p-2">
                    <img src="/images/files.png" alt="" className='w-20' />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary text-center">Academic + private
                  practice experience</h3>
              </div>

              <div className="bg-white rounded-xl p-6  transition shadow-lg duration-300 cursor-pointer border   hover:shadow-xl hover:-translate-y-[12px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 border h-20  rounded full mx-auto rounded-lg flex items-center justify-center  p-2">
                    <img src="/images/clock.png" alt="" className='w-20' />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-primary text-center">Reviews completed in
                  24–48 hours</h3>
              </div>
            </div>


          </div>
          <div className="doctors-slider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="content">
                <h1 className="text-3xl md:text-5xl font-semibold text-black leading-tight mb-2 text-center text-white">
                  Meet the Surgeons Behind Your <br /> Second Opinion
                </h1>
                <button className='mx-auto  items-center justify-center flex py-2 px-20 rounded-full border border-gray-200 bg-primary'>
                  <a href="">View All</a>
                </button>
              </div>
              <div className="z-100 relative mt-12">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  freeMode={true}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[FreeMode, Pagination]}
                  className="mySwiper "
                >
                  <SwiperSlide>
                    <div className="swiper-box  p-4 shadow bg-white rounded-md duration-300 hover:shadow-xl hover:-translate-y-[12px] shadow">
                      <img src="/images/doctor-img.jpg" alt="" className='w-full cover' />
                      <div className="doctor-name">
                        <h3 className='text-md font-normal text-gray-900  text-center'>Anthony Romeo, MD</h3>
                      </div>

                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-box  p-4 shadow bg-white rounded-md duration-300 hover:shadow-xl hover:-translate-y-[12px] shadow">
                      <img src="/images/doctor-img2.jpg" alt="" className='w-full cover' />
                      <div className="doctor-name">
                        <h3 className='text-md font-normal text-gray-900  text-center'>Samuel Rosas, MD, PhD, MBA</h3>
                      </div>

                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-box  p-4 shadow bg-white rounded-md duration-300 hover:shadow-xl hover:-translate-y-[12px] shadow">
                      <img src="/images/doctor-img3.jpg" alt="" className='w-full cover' />
                      <div className="doctor-name">
                        <h3 className='text-md font-normal text-gray-900  text-center'>T. David Luo, MD PhD</h3>
                      </div>

                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="swiper-box  p-4 shadow bg-white rounded-md duration-300 hover:shadow-xl hover:-translate-y-[12px] shadow">
                      <img src="/images/doctor-img.jpg" alt="" className='w-full cover' />
                      <div className="doctor-name">
                        <h3 className='text-md font-normal text-gray-900  text-center'>Anthony Romeo, MD</h3>
                      </div>

                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div className="swiper-box  p-4 shadow bg-white rounded-md duration-300 hover:shadow-xl hover:-translate-y-[12px] shadow">
                      <img src="/images/doctor-img.jpg" alt="" className='w-full cover' />
                      <div className="doctor-name">
                        <h3 className='text-md font-normal text-gray-900  text-center'>Anthony Romeo, MD</h3>
                      </div>

                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>

            </div>
          </div>
        </div>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-3 text-black">Why Our Surgeons Believe Every Patient Deserves a <br /> <span className='text-primary'>Second Opinion</span></h2>
            <p className='text-gray-600 mb-5'>Because making the right decision starts with understanding all your options.</p>

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
                href="/get-started"
                className="px-8  py-4 bg-primary hover:bg-purple-700 text-white rounded-full font-bold text-center transition-all shadow-lg  mx-auto mt-5"
              >
                Get A Second Opinion
              </Link>
            </div>

          </div>

        </section>


  <FAQ/>
        {/* Features Section */}

        <div className="clarity py-24 w-full">
          <div className="max-w-7xl mx-auto relative z-1000 items-center">
            <h2 className="text-3xl font-semibold mb-3 text-white text-center">Clarity changes everything.
            </h2>
            <div className="flex gap-10 mx-auto justify-center">
              <Link
                href="/get-started"
                className="px-8  py-4 bg-primary hover:bg-purple-700 text-white rounded-full font-bold text-center transition-all shadow-lg  mt-5 "
              >
                Get A Second Opinion
              </Link>

              <Link
                href="/get-started"
                className="px-8  py-4 border-white hover:bg-purple-700 text-white rounded-full font-bold text-center transition-all shadow-lg border-white border-2  mt-5 "
              >
                Get A Second Opinion
              </Link>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>



  );
}
