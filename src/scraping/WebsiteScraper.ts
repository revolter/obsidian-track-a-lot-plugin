import { WebpageDownloader } from './WebpageDownloader';

export class WebsiteScraper {
	constructor(private urls: string[]) {}

	async scrape(): Promise<Document[]> {
		return Promise.all(
			this.urls
			.map(async url => {
				const downloader = new WebpageDownloader(url);

				return await downloader.download();
			})
		);
	}
}
