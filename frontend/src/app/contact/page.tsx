'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { ClientLayout } from '@/components/client/client-layout';
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from '@/components/transitions';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/contact', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1600px]">
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-gray-900 mb-6 text-center">
                Get In Touch
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light text-center">
                Have a question or need assistance? We&apos;re here to help. Reach out to us anytime.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1600px]">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Left Side - Contact Information */}
              <div className="space-y-8">
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8 uppercase">
                    Contact Information
                  </h2>
                </FadeIn>
                
                <StaggerContainer className="space-y-6">
                  <StaggerItem>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 bg-[#7e1219] flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light uppercase tracking-wider text-sm text-gray-900 mb-2">Phone</h3>
                        <p className="text-gray-600 font-light text-lg">+91 98765 43210</p>
                        <p className="text-gray-600 font-light text-lg">+91 98765 43211</p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 bg-[#7e1219] flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light uppercase tracking-wider text-sm text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-600 font-light text-lg">info@vasukritijewels.com</p>
                        <p className="text-gray-600 font-light text-lg">support@vasukritijewels.com</p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 bg-[#7e1219] flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light uppercase tracking-wider text-sm text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-600 font-light text-lg">
                          123, Jewelry District<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex gap-4 items-start">
                      <div className="w-14 h-14 bg-[#7e1219] flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light uppercase tracking-wider text-sm text-gray-900 mb-2">Business Hours</h3>
                        <p className="text-gray-600 font-light text-lg">Monday - Saturday: 10 AM - 8 PM</p>
                        <p className="text-gray-600 font-light text-lg">Sunday: 11 AM - 6 PM</p>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                {/* Map Placeholder */}
                <FadeIn delay={0.5}>
                  <div className="relative h-80 bg-gray-100 overflow-hidden mt-8">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <MapPin className="h-16 w-16" strokeWidth={1.5} />
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Side - Contact Form */}
              <div>
                <FadeIn delay={0.2}>
                  <div className="bg-white border border-gray-200 p-8 lg:p-12">
                    <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-8 uppercase">
                      Send Us a Message
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-light uppercase tracking-wider text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          {...register('name')}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1 font-light">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-light uppercase tracking-wider text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          {...register('email')}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1 font-light">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-light uppercase tracking-wider text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500 mt-1 font-light">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-light uppercase tracking-wider text-gray-700 mb-2">
                          Subject *
                        </label>
                        <input
                          id="subject"
                          {...register('subject')}
                          placeholder="How can we help?"
                          className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light"
                        />
                        {errors.subject && (
                          <p className="text-sm text-red-500 mt-1 font-light">{errors.subject.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-light uppercase tracking-wider text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          {...register('message')}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light resize-none"
                        />
                        {errors.message && (
                          <p className="text-sm text-red-500 mt-1 font-light">{errors.message.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#7e1219] text-white px-10 py-4 font-light uppercase tracking-wider text-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            Send Message
                            <Send className="h-4 w-4" strokeWidth={1.5} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </FadeIn>
              </div>

            </div>
          </div>
        </section>

        {/* Quick Contact Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1600px] text-center">
            <FadeIn>
              <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-4 uppercase">
                Need Immediate Assistance?
              </h2>
              <p className="text-gray-600 mb-8 font-light text-lg max-w-2xl mx-auto">
                For urgent inquiries or order-related questions, please call us directly
              </p>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-10 py-4 font-light uppercase tracking-wider text-sm hover:bg-gray-900 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5" strokeWidth={1.5} />
                Call Now: +91 98765 43210
              </a>
            </FadeIn>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}
