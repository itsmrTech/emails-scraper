import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const redisConfig: RedisModuleOptions = {
  config: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password:
      process.env.REDIS_PASSWORD === ''
        ? undefined
        : process.env.REDIS_PASSWORD,
  },
};
