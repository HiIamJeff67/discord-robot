import { RedisOptions } from 'ioredis';

export const RedisPubSubOptions: RedisOptions = {
  host: process.env.REDIS_PUBSUB_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PUBSUB_PORT ?? 6379),
  password: process.env.REDIST_PUBSUB_PASSWORD,
  retryStrategy: (times: number) => {
    return Math.min(
      times * 50,
      Number(process.env.REDIS_PUBSUB_RETRY_MAXTIME ?? 2000),
    );
  },
};
