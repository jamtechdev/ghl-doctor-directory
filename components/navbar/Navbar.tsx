import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-0 z-[100] w-full">
            {/* <nav className='bg-primary border-b border-gray-100 font-sans py-4'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className='text-gray-600  text-center text-white'>Because making the right decision starts with understanding all your options.</p>
                </div>
            </nav> */}
            <header className='bg-white border-b border-gray-100 font-sans'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">

                        {/* Logo - Bold, Gray, Spaced */}
                        <div className="flex-shrink-0">
                            <span className="text-3xl font-black text-gray-500 tracking-tighter uppercase">
                                <img src="images/logo.png" alt="" className='w-40' />
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-gray-700 font-medium hover:text-purple-600 transition">
                                About Us
                            </a>

                            {/* Vertical Separator */}
                            <div className="h-6 w-px bg-gray-300"></div>

                            <a href="#" className="text-gray-700 font-medium hover:text-purple-600 transition">
                                Meet Your Surgeons
                            </a>

                            {/* Purple Button */}
                            <button className="bg-primary cursor-pointer hover:bg-[#7c3aed] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-sm">
                                                           <a href="auth/login">Login</a>

                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                            >
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4">
                        <a href="#" className="block text-gray-700 font-medium py-2">About Us</a>
                        <a href="#" className="block text-gray-700 font-medium py-2">Meet Your Surgeons</a>
                        <button className="w-full bg-primary text-white px-8 py-3 rounded-full font-semibold duration-300 transition hover:-translate-y-[12px]">
                           <a href="auth/login">Login</a>
                        </button>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Navbar;