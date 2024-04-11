import {config} from 'dotenv-safe';
config();
import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeController } from './scrape.controller';
import { ScrapeService } from './scrape.service';
import {
  FetchEmailsBackgroundDto,
  FetchEmailsDto,
  FollowUpFetchEmailsBackgroundRequestDto,
} from './scrape.dto';
import { PuppeteerModule } from 'nestjs-puppeteer';
import { BullModule } from '@nestjs/bull';
import { RedisClientModule } from '../redis/redis.module';
import { MockModule } from '../mock/scrub.module';

describe('ScrapeController', () => {
  let controller: ScrapeController;
  let service: ScrapeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        MockModule,
      ],
      controllers: [ScrapeController],
      providers: [ScrapeService],
    }).compile();

    controller = module.get<ScrapeController>(ScrapeController);
    service = module.get<ScrapeService>(ScrapeService);
  });

  describe('fetchEmails', () => {
    it('should fetch emails successfully', async () => {
      const fetchEmailsDto: FetchEmailsDto = {
        urls: [
          'http://localhost:3000/contact/1',
          'http://localhost:3000/contact/2',
        ],
      };
      const response = await controller.fetchEmails(fetchEmailsDto);
      expect(response.emails).toEqual(['mo@itsmrtech.com', 'info@google.com']);
    });
  });

  describe('fetchEmailsBackground', () => {
    it('should start background email fetching', async () => {
      const fetchEmailsBackgroundDto: FetchEmailsBackgroundDto = {
        urls: [
          'http://localhost:3000/contact/1',
          'http://localhost:3000/contact/2',
        ],
      };
      const response = await controller.fetchEmailsBackground(
        fetchEmailsBackgroundDto,
      );
      expect(response.requestId).toBeDefined();
    });
  });

  describe('followUpFetchEmailsBackgroundRequest', () => {
    it('should send a follow-up request for a background email fetching', async () => {
      const fetchEmailsBackgroundDto: FetchEmailsBackgroundDto = {
        urls: [
          'http://localhost:3000/contact/1',
          'http://localhost:3000/contact/2',
        ],
      };
      const { requestId } = await controller.fetchEmailsBackground(
        fetchEmailsBackgroundDto,
      );

      if (requestId) {
        const followUpFetchEmailsBackgroundRequestDto: FollowUpFetchEmailsBackgroundRequestDto =
          {
            requestId,
          };
        const response = await controller.followUpFetchEmailsBackgroundRequest(
          followUpFetchEmailsBackgroundRequestDto,
        );
        expect(response.requestUrls).toEqual(fetchEmailsBackgroundDto.urls);
      } else {
        throw new Error('requestId is not defined');
      }
    });
  });
});
