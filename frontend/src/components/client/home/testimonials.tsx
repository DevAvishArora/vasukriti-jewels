'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Absolutely stunning jewelry! The quality is exceptional and the designs are so unique. I get compliments every time I wear my necklace. The craftsmanship is impeccable and truly reflects Indian heritage.',
    initials: 'PS',
    featured: true,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: 'Bought an engagement ring here and my fiancée loved it! The customer service was excellent and the prices are very reasonable.',
    initials: 'RK',
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Bangalore',
    rating: 5,
    text: 'Beautiful collection and authentic products. Fast delivery and secure packaging. Highly recommend Vasukriti!',
    initials: 'AD',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur',
    rating: 5,
    text: 'The traditional designs with a modern touch are exactly what I was looking for. Quality and authenticity guaranteed.',
    initials: 'VS',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const featuredTestimonial = testimonials[currentIndex];
  const sideTestimonials = testimonials.filter((_, index) => index !== currentIndex).slice(0, 2);

  return (
    <section className="py-20 border-t border-gray-100 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-xs font-light uppercase tracking-wider" style={{ color: '#7e1219' }}>
            Trusted by thousands for their special moments
          </p>
        </motion.div>

        {/* Testimonials Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Featured Large Testimonial - Left 2 columns */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredTestimonial.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-2 p-12 h-full relative"
                style={{ borderColor: '#7e1219' }}
              >
                {/* Large Quote Icon */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Quote className="h-32 w-32" strokeWidth={1} style={{ color: '#7e1219' }} />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4"
                      fill="#7e1219"
                      stroke="#7e1219"
                      strokeWidth={1}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg font-light text-gray-900 mb-12 leading-relaxed relative z-10">
                  &ldquo;{featuredTestimonial.text}&rdquo;
                </p>

                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 border-2 flex items-center justify-center" style={{ borderColor: '#7e1219' }}>
                      <span className="text-sm font-light uppercase tracking-wider" style={{ color: '#7e1219' }}>
                        {featuredTestimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-light text-gray-900">
                        {featuredTestimonial.name}
                      </p>
                      <p className="text-xs font-light uppercase tracking-wider mt-1" style={{ color: '#7e1219' }}>
                        {featuredTestimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-10 h-10 border border-gray-200 hover:border-gray-900 transition-colors flex items-center justify-center group"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-10 h-10 border transition-colors flex items-center justify-center"
                      style={{ borderColor: '#7e1219', backgroundColor: '#7e1219' }}
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className="h-1 transition-all duration-300"
                      style={{
                        width: index === currentIndex ? '32px' : '4px',
                        backgroundColor: index === currentIndex ? '#7e1219' : '#e5e7eb'
                      }}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Testimonials - Right column */}
          <div className="space-y-6">
            {sideTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                onClick={() => setCurrentIndex(testimonials.indexOf(testimonial))}
              >
                {/* Hover accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#7e1219' }} />

                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-6 w-6 text-gray-200 group-hover:opacity-50 transition-opacity" strokeWidth={1} style={{ color: '#7e1219' }} />
                </div>

                {/* Review Text */}
                <p className="text-sm font-light text-gray-900 mb-6 leading-relaxed line-clamp-3">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 border border-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-light text-gray-900 uppercase">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-light text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs font-light text-gray-400 uppercase tracking-wider">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2" style={{ borderColor: '#7e1219' }}>
            <Star className="h-4 w-4" fill="#7e1219" stroke="#7e1219" strokeWidth={1} />
            <span className="text-xs font-light uppercase tracking-wider" style={{ color: '#7e1219' }}>
              Rated 4.9/5 from 2,500+ reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
