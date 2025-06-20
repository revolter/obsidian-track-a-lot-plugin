import { WebpageDownloader } from './WebpageDownloader';

interface WebsiteScraperSource<Context> {
	url: string;
	context?: Context;
}

export class WebsiteScraper<Context> {
	constructor(private sources: WebsiteScraperSource<Context>[]) {}

	async scrape<ParsedElement>(
		parseWebpage: (webpage: Document) => Element[],
		parseElement: (element: Element, context?: Context) => ParsedElement | null
	): Promise<ParsedElement[]> {
		const elements = await Promise.all(
			this.sources
			.map(async source => {
				const downloader = new WebpageDownloader(source.url);
				const webpage = await downloader.download();
				const elements = parseWebpage(webpage);

				return elements
					.map(element =>
						parseElement(element, source.context)
					)
					.filter((element): element is ParsedElement => element !== null);
			})
		);

		return elements.flat();
	}
}
