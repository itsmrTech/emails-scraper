import { Injectable } from '@nestjs/common';
import {
  IFetchEmailsFromWebpagesServiceInput,
  IFetchEmailsFromWebpagesServiceOutput,
} from './scrape.interface';
import { InjectBrowser } from 'nestjs-puppeteer';
import { Browser } from 'puppeteer';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { RedisClientService } from '../redis/redis.service';

@Processor('scrape')
export class ScrapeBullService {
  constructor(
    @InjectBrowser() private readonly browser: Browser,
    private readonly redisClientService: RedisClientService,
  ) {}
  @Process('fetch-emails-from-webpage')
  async processFetchEmailsFromWebpages(
    job: Job<{ url: string; emails?: string[]; requestId: string }>,
  ) {
    const { url } = job.data;

    const page = await this.browser.newPage();
    await page.goto(url);

    await page.waitForNetworkIdle();
    const html = await page.content();

    const regex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const emails = html.match(regex) || [];
    const uniqueEmails = [...new Set(emails)];

    await page.close();

    job.update({
      ...job.data,
      emails: uniqueEmails,
    });

    await this.redisClientService.setFetchEmailRequestProgress(
      {
        requestId: job.data.requestId,
        emails: uniqueEmails,
        url,
      },
      0,
    );

    return { emails: uniqueEmails };
  }
}
