import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrapeService } from './scrape.service';
import {
  FetchEmailsBackgroundDto,
  FetchEmailsDto,
  FollowUpFetchEmailsBackgroundRequestDto,
} from './scrape.dto';

@ApiTags('Scrape')
@Controller('/scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @ApiOperation({ summary: 'Fetch emails from webpages' })
  @ApiResponse({ status: 200, description: 'Emails fetched successfully' })
  @Post('/emails')
  fetchEmails(@Body() body: FetchEmailsDto) {
    return this.scrapeService.fetchEmailsFromWebpages({
      urls: body.urls,
    });
  }

  @ApiOperation({ summary: 'Fetch emails from webpages in the background' })
  @ApiResponse({
    status: 200,
    description: 'Background email fetching started',
  })
  @Post('/emails/background')
  fetchEmailsBackground(@Body() body: FetchEmailsBackgroundDto) {
    return this.scrapeService.fetchEmailsFromWebpagesBackground({
      urls: body.urls,
    });
  }

  @ApiOperation({ summary: 'Follow up on a background email fetching request' })
  @ApiResponse({ status: 200, description: 'Follow-up request sent' })
  @Get('/emails/background/follow-up/:requestId')
  followUpFetchEmailsBackgroundRequest(
    @Param() params: FollowUpFetchEmailsBackgroundRequestDto,
  ) {
    return this.scrapeService.followUpFetchEmailsBackgrounRequest({
      requestId: params.requestId,
    });
  }
}
