// API Configuration based on Git branch
// This allows different backend URLs for dev, staging, and production

export function getApiUrl(): string {
  // Check if we're in browser or server
  const isServer = typeof window === 'undefined';
  
  // In production, always use the production backend
  if (process.env.NODE_ENV === 'production') {
    // Check which Vercel branch we're on
    const vercelGitBranch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
    
    if (vercelGitBranch === 'development') {
      return 'https://vasukriti-backend-dev.onrender.com/api';
    }
    
    if (vercelGitBranch === 'staging') {
      return 'https://vasukriti-backend-staging.onrender.com/api';
    }
    
    // Default to production backend for main branch
    return process.env.NEXT_PUBLIC_API_URL || 'https://vasukriti-backend-prod.onrender.com/api';
  }
  
  // Development mode (local)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
}

export const API_URL = getApiUrl();
