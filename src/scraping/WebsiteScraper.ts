import { WebpageDownloader } from './WebpageDownloader';

interface WebsiteScraperSource<Context> {
	url: string;
	context?: Context;
}

export class WebsiteScraper<Context> {
	constructor(private sources: WebsiteScraperSource<Context>[]) {}

	async scrape<T>(
		parseWebpage: (webpage: Document) => Element[],
		parseElement: (elements: Element, context?: Context) => T
	): Promise<T[]> {
		const elements = await Promise.all(
			this.sources
			.map(async source => {
				const downloader = new WebpageDownloader(source.url);
				const webpage = await downloader.download();
				const elements = parseWebpage(webpage);

				return elements.map(element => {
					return parseElement(element, source.context);
				});
			})
		);

		return elements.flat();
	}
}
