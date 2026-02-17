import type { Metadata } from "next";
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const seoSettingsPath = path.join(dataDir, 'seo-settings.json');

function getSEOSettings() {
  if (!fs.existsSync(seoSettingsPath)) {
    return {
      directory: {
        title: "Doctor Directory - Find the Right Doctor for Your Needs",
        description: "Search and filter through our comprehensive directory of qualified doctors.",
        keywords: ["doctor directory", "find doctor", "medical professionals"],
        organization: {
          name: "Doctor Directory",
          description: "Find qualified doctors and specialists.",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
        },
        openGraph: {
          title: "Doctor Directory - Find the Right Doctor",
          description: "Search and filter through our comprehensive directory of qualified doctors.",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "Doctor Directory",
          description: "Find the right doctor for your needs.",
        },
        robots: {
          index: true,
          follow: true,
        },
      },
    };
  }
  const data = fs.readFileSync(seoSettingsPath, 'utf-8');
  return JSON.parse(data);
}

const seoSettings = getSEOSettings();
const dirSettings = seoSettings.directory;

export const metadata: Metadata = {
  title: dirSettings.title,
  description: dirSettings.description,
  keywords: dirSettings.keywords,
  openGraph: dirSettings.openGraph,
  twitter: dirSettings.twitter,
  robots: dirSettings.robots,
};

// Generate Organization schema for SEO (server-side only)
function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dirSettings.organization.name,
    description: dirSettings.organization.description,
    url: dirSettings.organization.url,
  };
}

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* Schema.org JSON-LD for SEO - Server-side only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {children}
    </>
  );
}
