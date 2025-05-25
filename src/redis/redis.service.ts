import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {

  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryStrategy: (times) => {
        if(times >= 5){
            console.error('Redis retry limit reached. No more attempts.');
            return null; // Stop retrying after 5 attempts
        }
        const delay = 3000;
        console.warn(`Redis reconnect attempt #${times}, retrying in ${delay}ms...`);
        return delay;
      },
    });

    this.client.on('connect', () => console.log('Redis connected Successfully'));
    this.client.on('ready', () => console.log('Redis ready to use'));
    this.client.on('error', (err) => console.error('Redis error:', err));
    this.client.on('close', () => console.warn('Redis connection closed'));
    this.client.on('reconnecting', () => console.log('Redis reconnecting...'));
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.quit(); // closes connection gracefully
    }
  }

  getClient(): Redis {
    return this.client;
  }

  // get cache value
  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // set cache
  async set<T>(key: string, value: T, ttl = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // invalidate cache
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // delete all cache
  async flushAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      await this.client.flushall();
    } else {
      console.warn('flushAll skipped in production');
    }
  }

  // delete cache for findAll with pagination posts and users
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}
