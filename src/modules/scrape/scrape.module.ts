import { Module } from '@nestjs/common';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import { PuppeteerModule } from 'nestjs-puppeteer';
import { BullModule } from '@nestjs/bull';
import { ScrapeBullService } from './scrape.bull.service';
import { RedisClientModule } from '../redis/redis.module';

@Module({
  imports: [
    PuppeteerModule.forRoot({ headless: false }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'scrape',
    }),
    RedisClientModule,
  ],
  controllers: [ScrapeController],
  providers: [ScrapeService, ScrapeBullService],
})
export class ScrapeModule {}
