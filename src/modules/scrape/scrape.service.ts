import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nestjs-puppeteer';
import { Browser } from 'puppeteer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RedisClientService } from '../redis/redis.service';
import {
  IFetchEmailsFromWebpagesBackgroundServiceInput,
  IFetchEmailsFromWebpagesBackgroundServiceOutput,
  IFetchEmailsFromWebpagesServiceInput,
  IFetchEmailsFromWebpagesServiceOutput,
  IFollowUpFetchEmailsBackgrounRequestServiceInput,
  IFollowUpFetchEmailsBackgrounRequestServiceOutput,
} from './scrape.interface';

@Injectable()
export class ScrapeService {
  constructor(
    @InjectBrowser() private readonly browser: Browser, // Inject the Puppeteer browser instance
    @InjectQueue('scrape') private readonly queue: Queue, // Inject the Bull queue instance
    private readonly redisClientService: RedisClientService, // Inject the Redis client service
  ) {}

  // Fetch emails from webpages
  async fetchEmailsFromWebpages(
    input: IFetchEmailsFromWebpagesServiceInput,
  ): Promise<IFetchEmailsFromWebpagesServiceOutput> {
    if (input.urls.length === 0) return { emails: [] };

    const responses = await Promise.all(
      input.urls.map(async (url) => {
        const page = await this.browser.newPage(); // Create a new page instance
        await page.goto(url); // Navigate to the specified URL

        await page.waitForNetworkIdle(); // Wait for the page to finish loading
        const html = await page.content(); // Get the HTML content of the page

        const regex = /[\w\.-]+@[\w\.-]+\.\w+/g; // Regular expression to match email addresses
        const emails = html.match(regex) || []; // Extract email addresses from the HTML

        const uniqueEmails = [...new Set(emails)]; // Remove duplicates from the email list
        await page.close(); // Close the page instance
        return { emails: uniqueEmails };
      }),
    );

    return { emails: [...new Set(responses.map((r) => r.emails).flat())] };
  }

  // Fetch emails from webpages in the background by adding jobs to the queue
  async fetchEmailsFromWebpagesBackground(
    input: IFetchEmailsFromWebpagesBackgroundServiceInput,
  ): Promise<IFetchEmailsFromWebpagesBackgroundServiceOutput> {
    const { urls } = input;
    if (urls.length === 0) return { requestId: null };
    const { requestId } =
      await this.redisClientService.createNewFetchEmailRequest({
        urls,
      });

    await Promise.all(
      urls.map(
        (url) =>
          this.queue.add(`fetch-emails-from-webpage`, { url, requestId }), // Add a job to the queue for each URL
      ),
    );

    return { requestId };
  }

  // Follow up on a background fetch emails request
  async followUpFetchEmailsBackgrounRequest(
    input: IFollowUpFetchEmailsBackgrounRequestServiceInput,
  ): Promise<IFollowUpFetchEmailsBackgrounRequestServiceOutput> {
    const { requestId } = input;
    const requestProgress = await this.redisClientService.getFetchEmailRequest({
      requestId,
    });

    return {
      emails: requestProgress.emails,
      progressPercentage: requestProgress.progress,
      requestUrls: requestProgress.requestUrls,
      scrapedUrls: requestProgress.scrapedUrls,
    };
  }
}
