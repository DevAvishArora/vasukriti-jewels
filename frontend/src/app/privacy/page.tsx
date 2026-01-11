'use client';

import { ClientLayout } from '@/components/client/client-layout';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-[#7e1219]" strokeWidth={1.5} />
            <h1 className="text-4xl font-light tracking-wide text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 font-light">
            Last updated: December 25, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-gray max-w-none"
        >
          <div className="space-y-8 font-light text-gray-700">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p>
                At Vasukriti, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Personal Information</h3>
              <p className="mb-3">We collect personal information that you provide to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment information (processed securely through payment gateway)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="mb-3">When you visit our website, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and browser information</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
                <li>Analyze website usage and trends</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="mb-3">We may share your information with:</p>
              
              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Service Providers</h3>
              <p>Third-party companies that help us operate our business (payment processors, shipping companies, marketing platforms). These providers are bound by confidentiality agreements.</p>

              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Legal Requirements</h3>
              <p>When required by law or to protect our rights, we may disclose information to law enforcement, regulatory authorities, or in legal proceedings.</p>

              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Business Transfers</h3>
              <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</p>

              <p className="mt-4 font-normal">
                We do not sell or rent your personal information to third parties for marketing purposes.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings, but disabling cookies may affect website functionality.
              </p>
              
              <h3 className="text-xl font-light text-gray-900 mb-3 mt-6">Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                <li><strong>Marketing Cookies:</strong> Track your browsing for personalized ads</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                6. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@vasukritijewels.com
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order information is retained for tax and accounting purposes as required by law.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                9. Children&apos;s Privacy
              </h2>
              <p>
                Our website is not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                10. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Significant changes will be communicated via email or website notice.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-6 bg-gray-50 border border-gray-200">
                <p className="mb-2"><strong>Vasukriti</strong></p>
                <p className="mb-1">Email: privacy@vasukritijewels.com</p>
                <p className="mb-1">Phone: +91 98765 43210</p>
                <p>Address: 123 Jewelry Lane, Mumbai, Maharashtra 400001, India</p>
              </div>
            </section>

            {/* Consent */}
            <section className="bg-[#7e1219] text-white p-6">
              <h2 className="text-xl font-light uppercase tracking-wider mb-3">
                Your Consent
              </h2>
              <p className="font-light">
                By using our website, you consent to this Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
