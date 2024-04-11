
---

# Email Address Scraper Service

A simple service that scrapes email addresses from a given URL. This project is developed as a part of HappyScribe Hiring Process and is not intended for any real-world use.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [License](#license)

## Installation

Just clone the repository and run the following command to install the dependencies.

```
npm install
```

---

## Usage

### Starting the Service

To start the service, run the following command:

```bash
npm start:dev
```

To start it in production mode, run:

```bash
npm run build
npm start:prod
```

The service will run on port 3000 by default. You can change the port by setting the PORT environment variable.

### Scraping Email Addresses

To scrape email addresses from a URL, send a POST request to the `/scrape/emails` endpoint with the URLs in the body:

```bash
curl -X POST http://localhost:3000/scrape/emails \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.google.com", "https://www.facebook.com"]}'
```

The response will be a JSON object with the emails found in the URLs.

### Background Email Scraping

To scrape emails from URLs using a queue, use the following API:

```bash
curl -X POST http://localhost:3000/scrape/emails/background \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://www.google.com", "https://www.facebook.com"]}'
```

The response will contain a request ID:

```json
{
  "requestId": "b0b08dce-472e-45c4-b5ba-b2f2bcefab33"
}
```

You can then use the following API to get the emails from the request ID (Polling Approach):

```bash
curl -X GET http://localhost:3000/scrape/emails/background/follow-up/b0b08dce-472e-45c4-b5ba-b2f2bcefab33
```

The response will include the emails found in the URLs along with the progress of the request.

---

## Known Issues

- The service is not able to scrape emails from the URLs that are behind a captcha.
- The service is not able to scrape emails from the URLs that are behind a login page.
- The service is not able to scrape emails from a webpage that load time is more than 30 seconds.
- For the sake of simplicity, the service may have some performance issues when scraping a large number of URLs.
- The method of being notified when a webpage is loaded is looking for the `network is idle` event in the browser. This may not cover all the cases where the webpage is fully loaded but it is the safest and simplest way to do it. It can be done in a more sophisticated way by listening to the API calls and the DOM changes but it is not implemented in this project.

## Contributing

It is a test project and is not intended for any real-world use. So, contributions are not useful for this project but you can fork the project and use it for your use.
