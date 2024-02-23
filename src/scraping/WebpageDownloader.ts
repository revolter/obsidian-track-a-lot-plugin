import { requestUrl } from 'obsidian';

export class WebpageDownloader {
	constructor(private url: string) {}

	async download(): Promise<Document> {
		const response = await requestUrl(this.url);

		return new DOMParser().parseFromString(response.text, 'text/html');
	}
}
