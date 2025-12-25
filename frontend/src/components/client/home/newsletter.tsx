'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 border-t border-gray-100 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-12 h-12 flex items-center justify-center border border-gray-900">
              <Mail className="h-5 w-5 text-gray-900" strokeWidth={1} />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Join Our Newsletter
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="text-xs font-light text-gray-400 uppercase tracking-wider mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Get 10% off your first order
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading || success}
                className="flex-1 px-4 py-3 border border-gray-200 text-sm font-light text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-3 text-sm font-light uppercase tracking-wider text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#7e1219' }}
              >
                {loading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                className="mt-3 text-xs font-light text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                className="mt-4 flex items-center justify-center gap-2 text-xs font-light text-green-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Check className="h-4 w-4" />
                Thank you for subscribing! Check your email for your discount code.
              </motion.div>
            )}

            {/* Privacy Note */}
            <p className="mt-4 text-xs font-light text-gray-400">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
