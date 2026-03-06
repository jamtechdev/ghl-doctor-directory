'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isLandingPage ? '' : 'pt-14 md:pt-16'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
