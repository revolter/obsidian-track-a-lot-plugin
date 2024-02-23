import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { WebsiteScraper } from 'src/scraping/WebsiteScraper';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { Recipe } from '../Recipe';
import { RecipeMarkdownListUpdater } from '../RecipeMarkdownListUpdater';
import { RecipeMarker } from '../RecipeMarker';
import { HanayamaHuzzle } from './HanayamaHuzzle';

export class HanayamaHuzzlesRecipe implements Recipe {
	static NAME = 'Hanayama Huzzles';
	static WEBPAGE = 'https://hanayama-toys.com/product-category/puzzles/huzzle';

	static #HEADERS = ['Level', 'Index', 'Name', 'Picture', 'Status'];
	static #SCRAPE_URLS = [
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-1-fun',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-2-easy',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-3-normal',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-4-hard',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-5-expert',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-6-grand-master',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/chess-puzzle'
	];

	#marker = new RecipeMarker(HanayamaHuzzlesRecipe.NAME);

	constructor(
		private markdownTableFactory: MarkdownTableFactory,
		private markdownTableConverter: MarkdownTableConverter,
		private trackablesUpdater: TrackablesUpdater
	) {}

	async updatedListInContent(content: string): Promise<string> {
		const updater = new RecipeMarkdownListUpdater(this.#marker);

		return updater.update(content, async markdownList => {
			const currentHuzzles = markdownList != null ? this.#markdownTableToHuzzles(markdownList) : [];
			const newHuzzles = await this.#scrapeHuzzles();

			return this.#updatedHuzzles(currentHuzzles, newHuzzles);
		});
	}

	#updatedHuzzles(currentHuzzles: HanayamaHuzzle[], newHuzzles: HanayamaHuzzle[]): string {
		const updatedHuzzles = this.trackablesUpdater.updatedTrackables(currentHuzzles, newHuzzles);

		return this.#huzzlesToMarkdownTableString(HanayamaHuzzlesRecipe.#HEADERS, updatedHuzzles);
	}

	async #scrapeHuzzles(): Promise<HanayamaHuzzle[]> {
		const metadataRegex = new RegExp(/\w+[ ](?<level>\d+)-(?<index>\d+)[ ](?<name>.+)/); // https://regex101.com/r/1vGzHd/2
		const scraper = new WebsiteScraper(HanayamaHuzzlesRecipe.#SCRAPE_URLS);

		return await scraper.scrape(
			content => {
				return Array.from(content.querySelectorAll('#main > .products > .product'));
			},
			product => {
				const title = product.querySelector('.product-info > .product-title > a')?.textContent || '';
				const titleMatch = title.match(metadataRegex);
				const titleGroups = titleMatch?.groups;

				const level = titleGroups != null ? titleGroups.level : 'N/A';
				const index = titleGroups != null ? titleGroups.index : 'N/A';
				const name = titleGroups != null ? titleGroups.name : title;

				const images = product.querySelectorAll('.product-thumb > a > img');
				const imageLinks = Array.from(images, image => (image as HTMLImageElement).src);

				return new HanayamaHuzzle(level, index, name, imageLinks);
			}
		);
	}

	#huzzlesToMarkdownTableString(headers: string[], huzzles: HanayamaHuzzle[]): string {
		const headerRow = this.markdownTableFactory.tableRowNode(
			headers.map(header => this.markdownTableFactory.textTableCellNode(header))
		);
		const huzzleRows = huzzles.map(huzzle =>
			this.markdownTableFactory.tableRowNode([
				this.markdownTableFactory.textTableCellNode(huzzle.level),
				this.markdownTableFactory.textTableCellNode(huzzle.index),
				this.markdownTableFactory.textTableCellNode(huzzle.name),
				this.markdownTableFactory.tableCellNode(
					this.markdownTableFactory.interleave(
						huzzle.imageLinks.map(imageLink => this.markdownTableFactory.imageNode(imageLink, 100)),
						this.markdownTableFactory.textNode(' ')
					)
				),
				this.markdownTableFactory.textTableCellNode(huzzle.status)
			])
		);
		const table = this.markdownTableFactory.table(headerRow, huzzleRows);

		return this.markdownTableConverter.tableToString(table);
	}

	#markdownTableToHuzzles(markdownTableString: string): HanayamaHuzzle[] {
		const arrayOfArrays = this.markdownTableConverter.arrayOfArraysFromString(markdownTableString);
		const imageLinksRegex = new RegExp(/!\[[^\]]+\]\((?<link>[^)]+)(?=\))/g); // https://regex101.com/r/YlCOgc/2

		return arrayOfArrays.flatMap(array => {
			if (array.length < 5) {
				return [];
			}

			const level = array[0];
			const index = array[1];
			const name = array[2];

			const images = array[3];
			const imageLinkMatches = images.matchAll(imageLinksRegex);
			const imageLinks = Array.from(imageLinkMatches).flatMap(match => {
				if (match == null || match.groups == null) {
					return [];
				}

				return match.groups.link;
			});

			const status = array[4];

			return new HanayamaHuzzle(level, index, name, imageLinks, status);
		});
	}
}
