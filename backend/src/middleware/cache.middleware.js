/**
 * In-Memory Cache Middleware
 * Caches API responses to reduce database load
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
    };
  }

  get(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() < cached.expiry) {
      this.stats.hits++;
      return cached.data;
    }
    
    if (cached) {
      this.cache.delete(key);
    }
    
    this.stats.misses++;
    return null;
  }

  set(key, data, duration = 300) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + duration * 1000,
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      size: this.cache.size,
    };
  }
}

const cacheService = new CacheService();

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 * @param {function} keyGenerator - Optional custom key generator
 */
const cache = (duration = 300, keyGenerator = null) => {
  return (req, res, next) => {
    // Skip cache for admin requests and mutations
    if (req.method !== 'GET' || req.user?.role === 'admin') {
      return next();
    }

    // Generate cache key
    const key = keyGenerator 
      ? keyGenerator(req) 
      : `${req.originalUrl || req.url}`;

    // Check cache
    const cached = cacheService.get(key);
    if (cached) {
      return res.json(cached);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache response
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(key, data, duration);
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for specific pattern
 */
const clearCache = (pattern) => {
  if (!pattern) {
    cacheService.clear();
    return;
  }

  const keys = Array.from(cacheService.cache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cacheService.delete(key);
    }
  });
};

/**
 * Cache stats endpoint
 */
const cacheStats = (req, res) => {
  res.json({
    success: true,
    data: cacheService.getStats(),
  });
};

module.exports = {
  cache,
  clearCache,
  cacheStats,
  cacheService,
};
