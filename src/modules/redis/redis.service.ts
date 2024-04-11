import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { JobId } from 'bull';
import {
  ICreateNewFetchEmailRequestServiceInput,
  ICreateNewFetchEmailRequestServiceOutput,
  IGetFetchEmailRequestServiceInput,
  IGetFetchEmailRequestServiceOutput,
  ISetFetchEmailRequestProgressServiceInput,
  ISetFetchEmailRequestProgressServiceOutput,
} from './redis.service.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RedisClientService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }
  async createNewFetchEmailRequest(
    input: ICreateNewFetchEmailRequestServiceInput,
  ): Promise<ICreateNewFetchEmailRequestServiceOutput> {
    const requestId = uuidv4();
    await this.redis.set(
      `fetch-emails-requests:${requestId}`,
      JSON.stringify({
        requestUrls: input.urls,
        emails: [],
        progress: 0,
        scrapedUrls: [],
      }),
    );
    return { requestId };
  }
  async setFetchEmailRequestProgress(
    input: ISetFetchEmailRequestProgressServiceInput,
    attempt: number,
  ): Promise<ISetFetchEmailRequestProgressServiceOutput> {
    if (attempt > 5) throw new Error('Failed to update request progress');
    const request = await this.getFetchEmailRequest({
      requestId: input.requestId,
    });
    request.emails = [...new Set([...request.emails, ...input.emails])];
    request.scrapedUrls.push(input.url);
    request.progress = Math.floor(
      (request.scrapedUrls.length / request.requestUrls.length) * 100,
    );
    await this.redis.set(
      `fetch-emails-requests:${input.requestId}`,
      JSON.stringify(request),
    );

    //double check if the request update is placed (as some async jobs may be running in the background and overwrite the request data while this function is running)

    const updatedRequest = await this.getFetchEmailRequest({
      requestId: input.requestId,
    });
    if (!updatedRequest.scrapedUrls.find((url: string) => url === input.url))
      return this.setFetchEmailRequestProgress(input, attempt + 1);
    return { progress: request.progress };
  }

  async getFetchEmailRequest(
    input: IGetFetchEmailRequestServiceInput,
  ): Promise<IGetFetchEmailRequestServiceOutput> {
    const redisValue = await this.redis.get(
      `fetch-emails-requests:${input.requestId}`,
    );
    const request = JSON.parse(redisValue);
    return {
      emails: request.emails,
      progress: request.progress,
      requestUrls: request.requestUrls,
      scrapedUrls: request.scrapedUrls,
    };
  }
}
