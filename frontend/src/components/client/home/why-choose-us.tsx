'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, Award, RefreshCw, Heart, Sparkles, Star, CheckCircle, Gift, Gem } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

const iconMap: { [key: string]: any } = {
  shield: Shield,
  truck: Truck,
  award: Award,
  refresh: RefreshCw,
  heart: Heart,
  sparkles: Sparkles,
  certificate: Award,
  hammer: Award,
  star: Star,
  check: CheckCircle,
  gift: Gift,
  diamond: Gem,
};

interface Feature {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export function WhyChooseUs() {
  const [features, setFeatures] = useState<Feature[]>([
    { _id: '1', title: 'Certified Jewelry', description: 'BIS Hallmarked & Certified', icon: 'shield', order: 1 },
    { _id: '2', title: 'Free Shipping', description: 'On all orders across India', icon: 'truck', order: 2 },
    { _id: '3', title: 'Lifetime Warranty', description: 'Manufacturing defects covered', icon: 'award', order: 3 },
    { _id: '4', title: 'Easy Returns', description: '15-day return policy', icon: 'refresh', order: 4 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await axiosInstance.get('/why-choose-us');
      if (response.data.success && response.data.data.length > 0) {
        setFeatures(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching why-choose-us features:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 border border-gray-300"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Award;
            
            return (
              <motion.div
                key={feature._id}
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



