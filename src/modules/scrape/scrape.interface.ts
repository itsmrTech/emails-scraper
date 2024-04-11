export interface IFetchEmailsFromWebpagesServiceInput {
  urls: string[];
}

export interface IFetchEmailsFromWebpagesServiceOutput {
  emails: string[];
}

export interface IFetchEmailsFromWebpagesBackgroundServiceInput {
  urls: string[];
}
export interface IFetchEmailsFromWebpagesBackgroundServiceOutput {
  requestId: string | null;
}

export interface IFollowUpFetchEmailsBackgrounRequestServiceInput {
  requestId: string;
}
export interface IFollowUpFetchEmailsBackgrounRequestServiceOutput {
  emails: string[];
  progressPercentage: number;
  requestUrls: string[];
  scrapedUrls: string[];
}
