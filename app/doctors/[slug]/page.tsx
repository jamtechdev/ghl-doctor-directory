/**
 * Individual Doctor Profile Page
 * 
 * This page displays detailed information about a single doctor.
 * 
 * Features:
 * - Static Site Generation (SSG) for all doctor profiles
 * - Full biography and professional details
 * - Schema.org JSON-LD markup for SEO
 * - Back link to directory
 * - Responsive layout
 * 
 * How to add new doctor profiles:
 * 1. Add doctor data to data/doctors.json
 * 2. Run `npm run build` to regenerate static pages
 * 3. The new profile will be available at /doctors/[slug]
 */

import { notFound } from 'next/navigation';
import { getDoctorBySlug, getAllDoctorSlugs } from '@/lib/utils';
import { Doctor } from '@/types/doctor';
import DoctorProfileContent from '@/components/DoctorProfileContent';

// Generate static paths for all doctors
export async function generateStaticParams() {
  const slugs = getAllDoctorSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each doctor page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const doctor = getDoctorBySlug(resolvedParams.slug);

  if (!doctor) {
    return {
      title: 'Doctor Not Found',
    };
  }

  return {
    title: `${doctor.name} - ${doctor.specialty} | Doctor Directory`,
    description: doctor.bio.substring(0, 160) + '...',
    openGraph: {
      title: `${doctor.name} - ${doctor.specialty}`,
      description: doctor.bio.substring(0, 160) + '...',
      type: 'profile',
    },
  };
}

// Generate Schema.org JSON-LD for doctor
function generateDoctorSchema(doctor: Doctor) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    medicalSpecialty: doctor.specialties,
    address: {
      '@type': 'PostalAddress',
      addressLocality: doctor.location.city,
      addressRegion: doctor.location.state,
      streetAddress: doctor.location.address,
      postalCode: doctor.location.zipCode,
    },
    ...(doctor.contact?.phone && {
      telephone: doctor.contact.phone,
    }),
    ...(doctor.contact?.email && {
      email: doctor.contact.email,
    }),
    ...(doctor.contact?.website && {
      url: doctor.contact.website,
    }),
    ...(doctor.education && {
      alumniOf: doctor.education.map(edu => ({
        '@type': 'EducationalOrganization',
        name: edu.institution,
      })),
    }),
  };
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const doctor = getDoctorBySlug(resolvedParams.slug);

  if (!doctor) {
    notFound();
  }

  const doctorSchema = generateDoctorSchema(doctor);

  return <DoctorProfileContent doctor={doctor} doctorSchema={doctorSchema} />;
}
