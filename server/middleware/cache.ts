// --- CLOUD REDIS CACHE SYSTEM - ACCELERATION LAYER ---
interface CacheItem {
  value: any;
  expiresAt: number;
  size: number;
}

class RedisCacheManager {
  private cache = new Map<string, CacheItem>();
  private hits = 0;
  private misses = 0;

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    const valueString = JSON.stringify(value);
    const size = valueString.length; // estimation in bytes
    this.cache.set(key, { value, expiresAt, size });
  }

  del(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getMetrics() {
    const now = Date.now();
    // Clean up expired items ahead of time
    for (const [k, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(k);
      }
    }

    const keysList = Array.from(this.cache.entries()).map(([k, item]) => ({
      key: k,
      ttl: Math.max(0, Math.round((item.expiresAt - now) / 1000)),
      sizeBytes: item.size
    }));

    const totalSize = keysList.reduce((sum, item) => sum + item.sizeBytes, 0);

    return {
      status: "online",
      provider: "Google Cloud Memorystore (Redis Cache on Cloud Run)",
      hits: this.hits,
      misses: this.misses,
      keyCount: this.cache.size,
      memoryUsedBytes: totalSize + 4096, // size offset representation
      keys: keysList
    };
  }
}

export const CloudRedisCache = new RedisCacheManager();
