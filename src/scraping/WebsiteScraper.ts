import { WebpageDownloader } from './WebpageDownloader';

export class WebsiteScraper {
	constructor(private urls: string[]) {}

	async scrape(parseWebpage: (webpage: Document) => Element[]): Promise<Element[]> {
		const elements = await Promise.all(
			this.urls
			.map(async url => {
				const downloader = new WebpageDownloader(url);
				const webpage = await downloader.download();

				return parseWebpage(webpage);
			})
		);

		return elements.flat();
	}
}
