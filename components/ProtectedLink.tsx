'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, MouseEvent } from 'react';

interface ProtectedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ProtectedLink({ href, children, className, onClick }: ProtectedLinkProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }

    // If not logged in, prevent default navigation and redirect to login
    if (!loading && !user) {
      e.preventDefault();
      router.push('/auth/login');
      return;
    }

    // If logged in, allow normal navigation
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
