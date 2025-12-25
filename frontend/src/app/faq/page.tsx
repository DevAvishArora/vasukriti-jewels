'use client';

import { useState, useMemo } from 'react';
import { Search, Package, Truck, RotateCcw, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { ClientLayout } from '@/components/client/client-layout';
import { FadeIn } from '@/components/transitions';

const faqData = [
  {
    category: 'Orders',
    icon: ShoppingBag,
    questions: [
      {
        question: 'How do I place an order?',
        answer: 'Browse our collections, add items to your cart, proceed to checkout, and complete the payment. You\'ll receive an order confirmation email with tracking details.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our customer support immediately. Once the order is processed, modifications may not be possible.',
      },
      {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'Yes, we offer COD for orders below ₹50,000. A nominal COD fee may apply. COD is available for select serviceable areas only.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, net banking, UPI, digital wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery for eligible orders.',
      },
    ],
  },
  {
    category: 'Shipping',
    icon: Truck,
    questions: [
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days. Express delivery (1-3 business days) is available for select locations at an additional cost. Custom orders may take 2-3 weeks.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to select international destinations. International shipping takes 10-15 business days. Additional customs duties may apply based on your country.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once shipped, you\'ll receive a tracking number via email and SMS. You can also track your order from the "My Orders" section in your account.',
      },
      {
        question: 'What are the shipping charges?',
        answer: 'Free shipping on orders above ₹10,000. For orders below ₹10,000, a flat shipping fee of ₹150 applies. Express delivery costs ₹500 extra.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    icon: RotateCcw,
    questions: [
      {
        question: 'What is your return policy?',
        answer: '7-day return policy from the date of delivery. Products must be unused, in original packaging with all tags and certificates. Custom-made items are non-returnable.',
      },
      {
        question: 'How do I return a product?',
        answer: 'Initiate a return request from your account\'s "My Orders" section. Our team will arrange a pickup. Refunds are processed within 7-10 business days after quality check.',
      },
      {
        question: 'Can I exchange a product?',
        answer: 'Yes, exchanges are available within 7 days. You can exchange for a different size, design, or product of equal or higher value. Price difference must be paid if applicable.',
      },
      {
        question: 'Are there any items that cannot be returned?',
        answer: 'Custom-made jewelry, engraved items, earrings (hygiene reasons), sale items, and gift cards are non-returnable. Please check product details before purchasing.',
      },
    ],
  },
  {
    category: 'Products',
    icon: Package,
    questions: [
      {
        question: 'Are your products certified?',
        answer: 'Yes, all gold jewelry comes with BIS Hallmark certification. Diamond jewelry includes IGI/GIA certificates. We provide authenticity certificates with every purchase.',
      },
      {
        question: 'What is the purity of gold used?',
        answer: 'We offer jewelry in 14K, 18K, and 22K gold. Each product listing clearly mentions the gold purity. All items are BIS hallmarked for authenticity.',
      },
      {
        question: 'Can I customize a design?',
        answer: 'Yes, we offer customization services. You can modify existing designs or create something entirely new. Our design team will work with you. Custom orders take 2-3 weeks.',
      },
      {
        question: 'Do you offer resizing services?',
        answer: 'Yes, complimentary resizing is available for rings purchased from us within 30 days. Subsequent resizing may incur charges based on complexity.',
      },
    ],
  },
  {
    category: 'Account & Support',
    icon: User,
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Sign In" in the header, then select "Create Account". Fill in your details and verify your email. You can also checkout as a guest without creating an account.',
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions to create a new password.',
      },
      {
        question: 'How can I contact customer support?',
        answer: 'Email us at support@vasukritijewels.com, call +91 98765 43210 (10 AM - 8 PM), or use the contact form. We respond within 24 hours on business days.',
      },
      {
        question: 'Do you have a physical store?',
        answer: 'Yes, our flagship store is in Mumbai. Visit our Contact page for address and hours. We recommend booking an appointment for personalized service.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqData;

    const query = searchQuery.toLowerCase();
    return faqData
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchQuery]);

  return (
    <ClientLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 font-light">
              Find answers to common questions about our products, orders, and services
            </p>
          </FadeIn>
          
          {/* Search Bar */}
          <FadeIn delay={0.5}>
            <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-14 text-lg border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors font-light"
            />
          </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-8">
                {filteredFAQs.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category} className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#7e1219] flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-light tracking-wide text-gray-900 uppercase">
                          {category.category}
                        </h2>
                      </div>
                      <div className="space-y-2">
                        {category.questions.map((faq, index) => {
                          const itemId = `${category.category}-${index}`;
                          const isOpen = openItem === itemId;
                          
                          return (
                            <div
                              key={itemId}
                              className="bg-white border border-gray-200 overflow-hidden"
                            >
                              <button
                                onClick={() => setOpenItem(isOpen ? null : itemId)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                              >
                                <span className="font-light text-gray-900">
                                  {faq.question}
                                </span>
                                <ChevronDown
                                  className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                                    isOpen ? 'rotate-180' : ''
                                  }`}
                                  strokeWidth={1.5}
                                />
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-4 text-gray-600 leading-relaxed font-light">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 font-light">
                  Try searching with different keywords or browse all categories
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-4 uppercase">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto font-light">
            Can&apos;t find the answer you&apos;re looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#7e1219] text-white hover:bg-opacity-90 transition-colors font-light uppercase tracking-wider text-sm"
            >
              Contact Support
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors font-light uppercase tracking-wider text-sm"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
    </ClientLayout>
  );
}
