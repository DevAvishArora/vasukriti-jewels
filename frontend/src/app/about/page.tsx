import { Metadata } from 'next';
import axiosInstance from '@/lib/axios';
import { ClientLayout } from '@/components/client/client-layout';
import DynamicAboutContent from '@/components/client/about/dynamic-about-content';

export const metadata: Metadata = {
  title: 'About Us - Vasukriti',
  description: 'Discover the story behind Vasukriti. Learn about our craftsmanship, values, and commitment to creating timeless jewelry pieces.',
};

async function getAboutContent() {
  try {
    const response = await axiosInstance.get('/page-content/about');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <ClientLayout>
      <DynamicAboutContent content={content} />
    </ClientLayout>
  );
}
