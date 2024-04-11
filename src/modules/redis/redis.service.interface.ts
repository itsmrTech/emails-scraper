export interface ISetFetchEmailRequestProgressServiceInput {
  requestId: string;
  emails: string[];
  url: string;
}
export interface ISetFetchEmailRequestProgressServiceOutput {
  progress: number;
}
export interface ICreateNewFetchEmailRequestServiceInput {
  urls: string[];
}
export interface ICreateNewFetchEmailRequestServiceOutput {
  requestId: string;
}

export interface IGetFetchEmailRequestServiceInput {
  requestId: string;
}
export interface IGetFetchEmailRequestServiceOutput {
  emails: string[];
  progress: number;
  requestUrls: string[];
  scrapedUrls: string[];
}
