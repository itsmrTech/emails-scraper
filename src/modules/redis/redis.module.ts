import { Module } from '@nestjs/common';
import { redisConfig } from './redis.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisClientService } from './redis.service';

@Module({
  imports: [RedisModule.forRoot(redisConfig)],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
