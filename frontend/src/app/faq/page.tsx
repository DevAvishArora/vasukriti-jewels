'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Package, Truck, RotateCcw, ShoppingBag, User, ChevronDown, HelpCircle, CreditCard } from 'lucide-react';
import { ClientLayout } from '@/components/client/client-layout';
import { FadeIn } from '@/components/transitions';
import axiosInstance from '@/lib/axios-instance';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  isDraft: boolean;
  tags: string[];
}

interface CategoryData {
  category: string;
  icon: any;
  questions: FAQ[];
}

// Category icon mapping
const categoryIcons: Record<string, any> = {
  general: HelpCircle,
  shipping: Truck,
  returns: RotateCcw,
  payment: CreditCard,
  products: Package,
  orders: ShoppingBag,
  account: User,
};

// Category label mapping
const categoryLabels: Record<string, string> = {
  general: 'General',
  shipping: 'Shipping & Delivery',
  returns: 'Returns & Exchanges',
  payment: 'Payment',
  products: 'Products',
  orders: 'Orders',
  account: 'Account & Support',
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/cms/faq/active');
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Group FAQs by category
  const faqData: CategoryData[] = useMemo(() => {
    const grouped: Record<string, FAQ[]> = {};
    
    faqs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });

    return Object.keys(grouped).map((category) => ({
      category: categoryLabels[category] || category,
      icon: categoryIcons[category] || HelpCircle,
      questions: grouped[category].sort((a, b) => a.order - b.order),
    }));
  }, [faqs]);

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
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#7e1219] border-r-transparent mb-4"></div>
                <p className="text-gray-600 font-light">Loading FAQs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-red-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light tracking-wide text-gray-900 mb-2">
                  Unable to Load FAQs
                </h3>
                <p className="text-gray-600 font-light mb-4">{error}</p>
                <button
                  onClick={fetchFAQs}
                  className="px-6 py-2 bg-[#7e1219] text-white hover:bg-opacity-90 transition-colors font-light uppercase tracking-wider text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : filteredFAQs.length > 0 ? (
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
                        {category.questions.map((faq) => {
                          const itemId = `${category.category}-${faq._id}`;
                          const isOpen = openItem === itemId;
                          
                          return (
                            <div
                              key={faq._id}
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
