import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import fs from 'fs';
import path from 'path';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Get SEO settings from seo-settings.json
const dataDir = path.join(process.cwd(), 'data');
const seoSettingsPath = path.join(dataDir, 'seo-settings.json');

function getSEOSettings() {
  if (!fs.existsSync(seoSettingsPath)) {
    return {
      directory: {
        title: "Doctor Directory - Find the Right Doctor for Your Needs",
        description: "Search and filter through our comprehensive directory of qualified doctors. Find specialists by name, specialty, condition, or location.",
        keywords: ["doctor directory", "find doctor", "medical professionals", "specialists", "healthcare", "physician search"],
        organization: {
          name: "Doctor Directory",
          description: "Find qualified doctors and specialists by specialty, location, and condition.",
          url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
          logo: "",
          phone: "",
          email: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "USA"
          }
        },
        openGraph: {
          enabled: true,
          title: "Doctor Directory - Find the Right Doctor",
          description: "Search and filter through our comprehensive directory of qualified doctors.",
          type: "website",
          image: "",
          siteName: "Doctor Directory"
        },
        twitter: {
          enabled: true,
          card: "summary_large_image",
          title: "Doctor Directory",
          description: "Find the right doctor for your needs.",
          image: "",
          site: "",
          creator: ""
        },
        robots: {
          index: true,
          follow: true,
          noarchive: false,
          nosnippet: false,
          noimageindex: false,
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1
        },
        canonicalUrl: "",
        alternateLanguages: [],
        analytics: {
          googleAnalyticsId: "",
          googleTagManagerId: "",
          facebookPixelId: "",
          microsoftClarityId: ""
        },
        socialMedia: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
          youtube: ""
        },
        structuredData: {
          enabled: true,
          organizationSchema: true,
          breadcrumbSchema: true,
          websiteSchema: true
        },
        sitemap: {
          enabled: true,
          changefreq: "weekly",
          priority: 0.8
        }
      },
    };
  }
  const data = fs.readFileSync(seoSettingsPath, 'utf-8');
  return JSON.parse(data);
}

const seoSettings = getSEOSettings();
const dirSettings = seoSettings.directory;

// Generate robots meta based on settings
const robotsMeta: Metadata['robots'] = {
  index: dirSettings.robots.index,
  follow: dirSettings.robots.follow,
  ...(dirSettings.robots.noarchive && { noarchive: true }),
  ...(dirSettings.robots.nosnippet && { nosnippet: true }),
  ...(dirSettings.robots.noimageindex && { noimageindex: true }),
  ...(dirSettings.robots.maxSnippet !== -1 && { 'max-snippet': dirSettings.robots.maxSnippet }),
  ...(dirSettings.robots.maxImagePreview && { 'max-image-preview': dirSettings.robots.maxImagePreview as 'none' | 'standard' | 'large' }),
  ...(dirSettings.robots.maxVideoPreview !== -1 && { 'max-video-preview': dirSettings.robots.maxVideoPreview }),
};

// Generate Open Graph metadata
const openGraphMeta: Metadata['openGraph'] = dirSettings.openGraph.enabled ? {
  title: dirSettings.openGraph.title || dirSettings.title,
  description: dirSettings.openGraph.description || dirSettings.description,
  type: dirSettings.openGraph.type as 'website' | 'article',
  ...(dirSettings.openGraph.image && { images: [dirSettings.openGraph.image] }),
  ...(dirSettings.openGraph.siteName && { siteName: dirSettings.openGraph.siteName }),
} : undefined;

// Generate Twitter Card metadata
const twitterMeta: Metadata['twitter'] = dirSettings.twitter.enabled ? {
  card: dirSettings.twitter.card as 'summary' | 'summary_large_image' | 'app' | 'player',
  title: dirSettings.twitter.title || dirSettings.title,
  description: dirSettings.twitter.description || dirSettings.description,
  ...(dirSettings.twitter.image && { images: [dirSettings.twitter.image] }),
  ...(dirSettings.twitter.site && { site: dirSettings.twitter.site }),
  ...(dirSettings.twitter.creator && { creator: dirSettings.twitter.creator }),
} : undefined;

export const metadata: Metadata = {
  title: dirSettings.title,
  description: dirSettings.description,
  keywords: dirSettings.keywords,
  openGraph: openGraphMeta,
  twitter: twitterMeta,
  robots: robotsMeta,
  ...(dirSettings.canonicalUrl && { alternates: { canonical: dirSettings.canonicalUrl } }),
};

// Generate Organization schema for SEO
function generateOrganizationSchema() {
  const org = dirSettings.organization;
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url,
  };

  if (org.logo) {
    schema.logo = org.logo;
  }

  if (org.phone || org.email || org.address) {
    schema.contactPoint = {};
    if (org.phone) schema.contactPoint.telephone = org.phone;
    if (org.email) schema.contactPoint.email = org.email;
    schema.contactPoint['@type'] = 'ContactPoint';
  }

  if (org.address && (org.address.street || org.address.city)) {
    schema.address = {
      '@type': 'PostalAddress',
      ...(org.address.street && { streetAddress: org.address.street }),
      ...(org.address.city && { addressLocality: org.address.city }),
      ...(org.address.state && { addressRegion: org.address.state }),
      ...(org.address.zipCode && { postalCode: org.address.zipCode }),
      ...(org.address.country && { addressCountry: org.address.country }),
    };
  }

  return schema;
}

// Generate Website schema
function generateWebsiteSchema() {
  if (!dirSettings.structuredData.websiteSchema) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dirSettings.organization.name,
    url: dirSettings.organization.url,
    description: dirSettings.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = dirSettings.structuredData.organizationSchema 
    ? generateOrganizationSchema() 
    : null;
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Schema.org JSON-LD for SEO */}
        {organizationSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        )}
        {websiteSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
        )}

        {/* Google Analytics */}
        {dirSettings.analytics.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${dirSettings.analytics.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${dirSettings.analytics.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {dirSettings.analytics.googleTagManagerId && (
          <>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${dirSettings.analytics.googleTagManagerId}');
              `}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${dirSettings.analytics.googleTagManagerId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}

        {/* Facebook Pixel */}
        {dirSettings.analytics.facebookPixelId && (
          <>
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${dirSettings.analytics.facebookPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${dirSettings.analytics.facebookPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Microsoft Clarity */}
        {dirSettings.analytics.microsoftClarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${dirSettings.analytics.microsoftClarityId}");
            `}
          </Script>
        )}

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
