'use client';

import { ClientLayout } from '@/components/client/client-layout';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-[#7e1219]" strokeWidth={1.5} />
            <h1 className="text-4xl font-light tracking-wide text-gray-900">
              Terms & Conditions
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
                Welcome to Vasukriti Jewels. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase or using our services.
              </p>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                2. Use of Website
              </h2>
              <p className="mb-3">You agree to use our website only for lawful purposes and in accordance with these Terms. You must not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Use any automated system to scrape or collect data from the website</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                3. Account Registration
              </h2>
              <p>
                To make purchases, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </section>

            {/* Product Information */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                4. Product Information
              </h2>
              <p>
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is error-free. All jewelry weights, purity, and stone specifications are approximate and may vary slightly. We reserve the right to correct errors, inaccuracies, or omissions at any time without prior notice.
              </p>
            </section>

            {/* Orders and Payments */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                5. Orders and Payments
              </h2>
              <p className="mb-3">When you place an order:</p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>All orders are subject to product availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Prices are subject to change without notice</li>
                <li>Payment must be received before order processing</li>
                <li>We accept various payment methods as indicated at checkout</li>
              </ul>
              <p>
                Orders can be modified or cancelled within 1 hour of placement. After this period, we cannot guarantee modifications or cancellations as processing may have begun.
              </p>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                6. Pricing
              </h2>
              <p>
                All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. Gold jewelry prices are subject to fluctuations based on daily gold rates. The final price will be confirmed at the time of order placement.
              </p>
            </section>

            {/* Authenticity and Certification */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                7. Authenticity and Certification
              </h2>
              <p>
                All our jewelry is certified for authenticity and purity. We provide appropriate certification (BIS for gold, IGI/GIA for diamonds) with applicable products. Custom orders include detailed authenticity documentation.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                8. Intellectual Property
              </h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of Vasukriti Jewels and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, Vasukriti Jewels shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of our website or products. Our total liability shall not exceed the amount paid by you for the specific product or service.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                10. Dispute Resolution
              </h2>
              <p>
                Any disputes arising out of or relating to these Terms shall be resolved through good faith negotiations. If a resolution cannot be reached, disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, India.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                11. Modifications to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-4 p-6 bg-gray-50 border border-gray-200">
                <p className="mb-2"><strong>Vasukriti Jewels</strong></p>
                <p className="mb-1">Email: legal@vasukritijewels.com</p>
                <p className="mb-1">Phone: +91 98765 43210</p>
                <p>Address: 123 Jewelry Lane, Mumbai, Maharashtra 400001, India</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="bg-[#7e1219] text-white p-6">
              <h2 className="text-xl font-light uppercase tracking-wider mb-3">
                Acceptance of Terms
              </h2>
              <p className="font-light">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
