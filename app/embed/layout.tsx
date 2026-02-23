import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Directory - Find Your Doctor",
  description: "Search and find qualified doctors by specialty, location, or condition",
  robots: "noindex, nofollow", // Prevent indexing of embed pages
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="embed-container">
      {children}
    </div>
  );
}
