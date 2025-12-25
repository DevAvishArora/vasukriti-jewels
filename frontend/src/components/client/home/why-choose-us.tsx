'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Award, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Certified Jewelry',
    description: 'BIS Hallmarked & Certified',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders across India',
  },
  {
    icon: Award,
    title: 'Lifetime Warranty',
    description: 'Manufacturing defects covered',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '15-day return policy',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-gray-900">
                    <Icon className="h-5 w-5 text-gray-900" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-sm font-light tracking-wide text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs font-light text-gray-400 uppercase tracking-wider">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
