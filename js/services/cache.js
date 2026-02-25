'use strict';

/**
 * GF — CacheManager
 * Intelligent caching with TTL and change detection
 */
window.GF = window.GF || {};

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.lastHashes = new Map();
        this.hitCount = 0;
        this.missCount = 0;
        this.defaultTTL = 3 * 60 * 1000;
    }

    has(key) {
        if (!this.cache.has(key)) return false;
        const item = this.cache.get(key);
        if (item.expires && Date.now() >= item.expires) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    get(key) {
        if (!this.has(key)) { this.missCount++; return null; }
        this.hitCount++;
        return this.cache.get(key).value;
    }

    set(key, value, ttl = null) {
        const expirationTime = ttl || this.defaultTTL;
        this.cache.set(key, {
            value: value,
            expires: expirationTime > 0 ? Date.now() + expirationTime : null,
            created: Date.now()
        });
    }

    generateHash(data) {
        const str = JSON.stringify(data);
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    hasChanged(key, data) {
        const newHash = this.generateHash(data);
        const oldHash = this.lastHashes.get(key);
        this.lastHashes.set(key, newHash);
        if (!oldHash) return true;
        return oldHash !== newHash;
    }

    clear() {
        this.cache.clear();
        this.lastHashes.clear();
    }

    getStats() {
        const hitRate = this.hitCount + this.missCount > 0
            ? (this.hitCount / (this.hitCount + this.missCount) * 100).toFixed(1)
            : 0;
        return { size: this.cache.size, hits: this.hitCount, misses: this.missCount, hitRate: `${hitRate}%` };
    }
}

GF.cacheManager = new CacheManager();
console.log('✅ [GF] CacheManager initialized');
