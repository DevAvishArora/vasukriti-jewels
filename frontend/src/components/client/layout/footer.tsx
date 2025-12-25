'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-neutral-300" style={{ backgroundColor: '#7e1219' }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block text-xl font-light tracking-wider mb-6 text-white">
              VASUKRITI JEWELS
            </Link>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Crafting timeless elegance with premium handcrafted jewelry since 2014.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-light tracking-widest mb-6 uppercase text-white">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shop" className="text-neutral-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-neutral-300 hover:text-white transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="text-neutral-300 hover:text-white transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-neutral-300 hover:text-white transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-neutral-300 hover:text-white transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-light tracking-widest mb-6 uppercase text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-neutral-300 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-neutral-300 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-neutral-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-light tracking-widest mb-6 uppercase text-white">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:+911234567890"
                  className="text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  +91 1234 567 890
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@vasukritijewels.com"
                  className="text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  support@vasukritijewels.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="text-xs font-light tracking-widest mb-4 uppercase text-white">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-neutral-300">
            <p>© 2025 Vasukriti Jewels. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/policies/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/policies/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
