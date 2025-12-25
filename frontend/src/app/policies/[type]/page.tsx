import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, FileText, Truck, RotateCcw, Shield, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientLayout } from '@/components/client/client-layout';

const policies = {
  shipping: {
    title: 'Shipping Policy',
    icon: Truck,
    lastUpdated: 'November 2024',
    content: [
      {
        heading: 'Shipping Locations',
        text: 'We ship across India and to select international destinations. During checkout, you can verify if we deliver to your location.',
      },
      {
        heading: 'Delivery Timeline',
        text: 'Standard Delivery: 5-7 business days for domestic orders. Express Delivery: 1-3 business days (available for select locations). International Shipping: 10-15 business days. Custom orders may take 2-3 weeks for manufacturing.',
      },
      {
        heading: 'Shipping Charges',
        text: 'Free shipping on all orders above ₹10,000. Orders below ₹10,000 incur a flat shipping fee of ₹150. Express delivery costs an additional ₹500. International shipping charges vary based on destination.',
      },
      {
        heading: 'Order Tracking',
        text: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order anytime from the "My Orders" section in your account or using the tracking number on our courier partner\'s website.',
      },
      {
        heading: 'Packaging',
        text: 'All jewelry items are carefully packaged in elegant gift boxes with authenticity certificates. We ensure secure packaging to prevent any damage during transit. Insurance coverage is included for all shipments.',
      },
      {
        heading: 'Delivery Issues',
        text: 'If you face any delivery issues or your package is damaged, please contact us within 48 hours of delivery. We will investigate and provide a suitable resolution, including reshipping if necessary.',
      },
    ],
  },
  returns: {
    title: 'Returns & Exchange Policy',
    icon: RotateCcw,
    lastUpdated: 'November 2024',
    content: [
      {
        heading: 'Return Window',
        text: 'We offer a 7-day return policy from the date of delivery. To be eligible for a return, the product must be unused, in its original packaging, with all tags, certificates, and accessories intact.',
      },
      {
        heading: 'Non-Returnable Items',
        text: 'Custom-made jewelry, engraved items, earrings (for hygiene reasons), sale items marked as final sale, gift cards and vouchers cannot be returned or exchanged.',
      },
      {
        heading: 'Return Process',
        text: 'Log in to your account, go to "My Orders", select the order you wish to return, click "Return Item" and choose a reason. Our team will review your request within 24 hours. Once approved, we will arrange a free pickup from your address.',
      },
      {
        heading: 'Refund Timeline',
        text: 'After we receive and inspect the returned item, refunds are processed within 7-10 business days. The amount will be credited to your original payment method. For COD orders, refunds are issued via bank transfer.',
      },
      {
        heading: 'Exchanges',
        text: 'Exchanges are available within 7 days of delivery. You can exchange for a different size, design, or product. If the new product costs more, you\'ll need to pay the difference. If it costs less, we\'ll refund the difference.',
      },
      {
        heading: 'Damaged or Defective Products',
        text: 'If you receive a damaged or defective product, please contact us immediately with photos. We will arrange a replacement or full refund without requiring you to return the item first.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    lastUpdated: 'November 2024',
    content: [
      {
        heading: 'Information We Collect',
        text: 'We collect personal information you provide during account creation, checkout, or contact forms. This includes name, email, phone number, shipping address, and payment information. We also collect browsing data, device information, and cookies for analytics and user experience improvement.',
      },
      {
        heading: 'How We Use Your Information',
        text: 'We use your information to process orders, provide customer support, send order updates and promotional emails (with your consent), improve our website and services, prevent fraud and ensure security, and comply with legal obligations.',
      },
      {
        heading: 'Data Security',
        text: 'We implement industry-standard security measures to protect your data. All payment transactions are encrypted using SSL technology. We do not store complete credit card information on our servers. Access to personal data is restricted to authorized personnel only.',
      },
      {
        heading: 'Cookies',
        text: 'We use cookies to enhance your browsing experience, remember your preferences, analyze website traffic, and provide personalized content. You can disable cookies in your browser settings, but this may affect website functionality.',
      },
      {
        heading: 'Third-Party Services',
        text: 'We may share your information with trusted third-party service providers for payment processing, shipping, email marketing, and analytics. These providers are contractually obligated to keep your information secure and use it only for specified purposes.',
      },
      {
        heading: 'Your Rights',
        text: 'You have the right to access, update, or delete your personal information. You can unsubscribe from marketing emails anytime. To exercise these rights, contact us at privacy@vasukritijewels.com. We will respond within 30 days.',
      },
      {
        heading: 'Children\'s Privacy',
        text: 'Our services are not intended for individuals under 18. We do not knowingly collect personal information from children. If we discover we have collected such information, we will delete it promptly.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    icon: FileCheck,
    lastUpdated: 'November 2024',
    content: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing and using the Vasukriti Jewels website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.',
      },
      {
        heading: 'Product Information',
        text: 'We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that all information is error-free. Colors may vary slightly due to screen settings. We reserve the right to correct errors and update information without notice.',
      },
      {
        heading: 'Pricing and Payment',
        text: 'All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time. Payment must be completed before order processing. We accept various payment methods as listed on our checkout page.',
      },
      {
        heading: 'Order Acceptance',
        text: 'Your order is an offer to purchase. We reserve the right to accept or reject any order for any reason, including product availability, errors in pricing, or suspicion of fraud. If we reject your order after payment, we will issue a full refund.',
      },
      {
        heading: 'Intellectual Property',
        text: 'All content on this website, including text, images, logos, and designs, is the property of Vasukriti Jewels and protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.',
      },
      {
        heading: 'User Accounts',
        text: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and update it as necessary. Notify us immediately of any unauthorized use of your account.',
      },
      {
        heading: 'Limitation of Liability',
        text: 'Vasukriti Jewels shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the amount you paid for the product in question.',
      },
      {
        heading: 'Governing Law',
        text: 'These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.',
      },
    ],
  },
};

type PolicyType = keyof typeof policies;

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}): Promise<Metadata> {
  const policy = policies[params.type as PolicyType];
  
  if (!policy) {
    return {
      title: 'Policy Not Found',
    };
  }

  return {
    title: `${policy.title} - Vasukriti Jewels`,
    description: `Read our ${policy.title.toLowerCase()} to understand our policies and procedures.`,
  };
}

export default function PolicyPage({ params }: { params: { type: string } }) {
  const policy = policies[params.type as PolicyType];

  if (!policy) {
    notFound();
  }

  const Icon = policy.icon;

  return (
    <ClientLayout>
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-gray-600 hover:text-amber-600 mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <Icon className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {policy.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {policy.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {policy.content.map((section) => (
                <div key={section.heading} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Questions about our policies?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    If you have any questions or concerns about our policies, please don&apos;t hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="default">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/faq">View FAQs</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Policies */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Other Policies
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(policies)
                .filter(([key]) => key !== params.type)
                .map(([key, value]) => {
                  const PolicyIcon = value.icon;
                  return (
                    <Link
                      key={key}
                      href={`/policies/${key}`}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-amber-600 hover:shadow-md transition-all group"
                    >
                      <PolicyIcon className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {value.title}
                      </h3>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
    </ClientLayout>
  );
}

export function generateStaticParams() {
  return Object.keys(policies).map((type) => ({
    type,
  }));
}
