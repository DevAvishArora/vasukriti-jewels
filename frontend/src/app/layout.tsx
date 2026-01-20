import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant, Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import GlobalAudio from '@/components/audio/GlobalAudio';

// Primary Sans-Serif Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Luxury Serif Fonts
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Vasukriti - Handcrafted Luxury Jewellery",
  description: "Crafted to adorn your timeless elegance. Handcrafted jewellery inspired by tradition, designed for today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} ${manrope.variable} ${dmSans.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased bg-ivory-50 text-charcoal-900 overflow-x-hidden`}
      >
        <AuthProvider>
          {/* Global hidden audio element (controlled from header via events) */}
          <GlobalAudio />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
