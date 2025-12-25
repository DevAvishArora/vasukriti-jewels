'use client';

import { ClientLayout } from '@/components/client/client-layout';
import { motion } from 'framer-motion';
import { Truck, PackageCheck, RotateCcw, Clock, MapPin, Shield } from 'lucide-react';

export default function ShippingPage() {
  const shippingMethods = [
    {
      icon: Truck,
      title: 'Standard Delivery',
      time: '5-7 Business Days',
      cost: 'Free on orders above ₹5,000',
      description: 'Reliable delivery to your doorstep with tracking',
    },
    {
      icon: PackageCheck,
      title: 'Express Delivery',
      time: '2-3 Business Days',
      cost: '₹500 (Select locations)',
      description: 'Faster delivery for urgent orders',
    },
  ];

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="h-8 w-8 text-[#7e1219]" strokeWidth={1.5} />
            <h1 className="text-4xl font-light tracking-wide text-gray-900">
              Shipping & Returns
            </h1>
          </div>
          <p className="text-gray-600 font-light max-w-2xl mx-auto">
            We ensure your jewelry reaches you safely and securely. Read about our shipping and return policies below.
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8 text-center">
            Shipping Methods
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {shippingMethods.map((method, index) => (
              <div
                key={method.title}
                className="bg-white border border-gray-200 p-6 hover:border-gray-900 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#7e1219] text-white p-3 flex-shrink-0">
                    <method.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-gray-900 mb-2">{method.title}</h3>
                    <div className="space-y-1 mb-3">
                      <p className="text-gray-600 font-light flex items-center gap-2">
                        <Clock className="h-4 w-4" strokeWidth={1.5} />
                        {method.time}
                      </p>
                      <p className="text-[#7e1219] font-light">{method.cost}</p>
                    </div>
                    <p className="text-gray-600 font-light text-sm">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Shipping Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 bg-white border-2 border-gray-900 p-8"
        >
          <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-6">
            Shipping Policy
          </h2>
          <div className="space-y-6 font-light text-gray-700">
            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#7e1219]" strokeWidth={1.5} />
                Delivery Locations
              </h3>
              <p>
                We ship across India to most serviceable pin codes. International shipping is available to select countries. Delivery times may vary based on location and product availability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Processing Time</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ready-to-ship items: 1-2 business days</li>
                <li>Made-to-order items: 7-14 business days</li>
                <li>Customized jewelry: 2-3 weeks</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#7e1219]" strokeWidth={1.5} />
                Secure Packaging
              </h3>
              <p>
                All jewelry is securely packaged in tamper-proof boxes with insurance coverage. High-value orders require signature upon delivery for added security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Order Tracking</h3>
              <p>
                Once your order ships, you&apos;ll receive a tracking number via email and SMS. Track your order in real-time through our website or the courier&apos;s tracking portal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 mb-3">Shipping Charges</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free shipping on orders above ₹5,000</li>
                <li>Standard delivery: ₹150 for orders below ₹5,000</li>
                <li>Express delivery: ₹500 (where available)</li>
                <li>International shipping: Calculated at checkout based on destination</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Return Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-white border border-gray-200 p-8">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-6 flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-[#7e1219]" strokeWidth={1.5} />
              Return & Exchange Policy
            </h2>
            <div className="space-y-6 font-light text-gray-700">
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">30-Day Return Window</h3>
                <p>
                  We accept returns within 30 days of delivery for most products. The item must be in original condition with all tags, certificates, and packaging intact.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">Eligible for Return</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Damaged or defective items</li>
                  <li>Incorrect item received</li>
                  <li>Manufacturing defects</li>
                  <li>Items not matching description</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">Non-Returnable Items</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customized or personalized jewelry</li>
                  <li>Items worn or showing signs of use</li>
                  <li>Products without original packaging or certificates</li>
                  <li>Sale or clearance items (unless defective)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">Return Process</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact customer support within 30 days of delivery</li>
                  <li>Provide order number and reason for return</li>
                  <li>Receive return authorization and shipping instructions</li>
                  <li>Pack the item securely with all accessories</li>
                  <li>Ship via insured courier (we&apos;ll provide prepaid label for defects)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">Refund Timeline</h3>
                <p>
                  Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-light text-gray-900 mb-3">Exchange Policy</h3>
                <p>
                  Exchanges are available for size adjustments or design preferences. Size exchanges are free for the first exchange. Contact us within 7 days of delivery to initiate an exchange.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Lifetime Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#7e1219] text-white p-8"
        >
          <h2 className="text-3xl font-light tracking-wide mb-6 text-center">
            Lifetime Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-light uppercase tracking-wider mb-2">
                Free Cleaning
              </h3>
              <p className="text-sm font-light opacity-90">
                Complimentary cleaning service for all jewelry purchased from us
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light uppercase tracking-wider mb-2">
                Quality Check
              </h3>
              <p className="text-sm font-light opacity-90">
                Free quality inspection and maintenance recommendations
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light uppercase tracking-wider mb-2">
                Certificate Reissue
              </h3>
              <p className="text-sm font-light opacity-90">
                Lost your certificate? We&apos;ll help you get a duplicate
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 font-light mb-4">
            Have questions about shipping or returns?
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-[#7e1219] text-white px-8 py-3 font-light uppercase tracking-wider text-sm hover:bg-[#6a0f15] transition-colors"
          >
            Contact Customer Support
          </button>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
