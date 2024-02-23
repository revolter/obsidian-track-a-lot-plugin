import { WebpageDownloader } from './WebpageDownloader';

export class WebsiteScraper {
	constructor(private urls: string[]) {}

	async scrape<T>(
		parseWebpage: (webpage: Document) => Element[],
		parseElement: (elements: Element) => T
	): Promise<T[]> {
		const elements = await Promise.all(
			this.urls
			.map(async url => {
				const downloader = new WebpageDownloader(url);
				const webpage = await downloader.download();
				const elements = parseWebpage(webpage);

				return elements.map(element => {
					return parseElement(element);
				});
			})
		);

		return elements.flat();
	}
}
