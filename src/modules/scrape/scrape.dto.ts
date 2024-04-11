import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class FetchEmailsDto {
  @ApiProperty({
    example: [
      'https://www.multiverse.io/en-US',
      'https://binj.com/about-us',
      'https://www.istanbulfashioncenter.com/contact-us',
      'https://www.abseitsgermany.com/pages/about-us',
    ],
    description: 'The URLs to scrape emails from',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUrl({}, { each: true })
  urls: string[];
}

export class FetchEmailsBackgroundDto {
  @ApiProperty({
    example: [
      'https://www.multiverse.io/en-US',
      'https://binj.com/about-us',
      'https://www.istanbulfashioncenter.com/contact-us',
      'https://www.abseitsgermany.com/pages/about-us',
    ],
    description: 'The URLs to scrape emails from',
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUrl({}, { each: true })
  urls: string[];
}


export class FollowUpFetchEmailsBackgroundRequestDto {
  @ApiProperty({
    example: '03ca3d81-e927-4204-82a0-e6f1682a757e',
    description: 'The ID of the background request to follow up on',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;
}