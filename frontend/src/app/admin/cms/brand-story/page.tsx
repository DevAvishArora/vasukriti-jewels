'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandStoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to static content page with brand-story filter
    router.push('/admin/cms/static?page=brand-story');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Brand Story...</p>
      </div>
    </div>
  );
}
