import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { RegexFactory } from 'src/regex/RegexFactory';
import { WebsiteScraper } from 'src/scraping/WebsiteScraper';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { Recipe } from '../Recipe';
import { RecipeListUpdater } from '../helpers/RecipeListUpdater';
import { RecipeMarkdownListUpdater } from '../helpers/RecipeMarkdownListUpdater';
import { RecipeMarker } from '../helpers/RecipeMarker';
import { IQPuzzle } from './IQPuzzle';

export class IQPuzzlesRecipe implements Recipe {
	static readonly NAME = 'IQ Puzzles';
	static readonly WEBPAGE = 'https://www.iqpuzzle.com';

	static readonly #HEADERS: readonly string[] = ['Name', 'Picture', 'Status'];
	static readonly #SCRAPE_URL = 'https://www.iqpuzzle.com';

	#marker = new RecipeMarker(IQPuzzlesRecipe.NAME);

	constructor(
		private markdownTableFactory: MarkdownTableFactory,
		private markdownTableConverter: MarkdownTableConverter,
		private trackablesUpdater: TrackablesUpdater
	) {}

	async updatedListInContent(content: string): Promise<string> {
		const markdownUpdater = new RecipeMarkdownListUpdater(this.#marker);
		const updater = new RecipeListUpdater<IQPuzzle>(
			IQPuzzlesRecipe.#HEADERS,
			markdownUpdater,
			this.trackablesUpdater
		);

		return await updater.update(
			content,

			this.#markdownTableStringToPuzzles.bind(this),
			this.#scrapePuzzles.bind(this),
			this.#puzzlesToMarkdownTableString.bind(this)
		);
	}

	async #scrapePuzzles(): Promise<IQPuzzle[]> {
		const nameRegex = new RegExp(/\s*(?<name>[\w\s]+)$/); // https://regex101.com/r/AuK9pb/2
		const cleanedLinkRegex = new RegExp(/^(?<cleanedLink>.+?\.jpg)/); // https://regex101.com/r/fd3A6U/1
		const scraper = new WebsiteScraper([{
			url: IQPuzzlesRecipe.#SCRAPE_URL
		}]);

		return await scraper.scrape(
			content => {
				const lists = Array.from(content.querySelectorAll('ul[data-hook="product-list-wrapper"]'));

				if (lists.length < 2) {
					return [];
				}

				const list = lists[1];

				return Array.from(list.querySelectorAll('li'));
			},
			product => {
				const title = product.querySelector('p[data-hook="product-item-name"]')?.textContent;

				if (title == null) {
					return null;
				}

				const titleMatch = title.match(nameRegex);
				const titleGroups = titleMatch?.groups;

				const name = titleGroups?.name;

				if (name == null) {
					return null;
				}

				const image = product.querySelector('a wow-image img');
				const imageLink = image != null ? (image as HTMLImageElement).src : '';
				const cleanedImageLinkMatch = imageLink.match(cleanedLinkRegex);
				const cleanedImageLink = (cleanedImageLinkMatch != null && cleanedImageLinkMatch.groups != null)
					? cleanedImageLinkMatch.groups.cleanedLink
					: '';

				return new IQPuzzle(name.trim(), cleanedImageLink);
			}
		);
	}

	#puzzlesToMarkdownTableString(headers: string[], puzzles: IQPuzzle[]): string {
		const headerRow = this.markdownTableFactory.tableRowNode(
			headers.map(header => this.markdownTableFactory.textTableCellNode(header))
		);
		const puzzleRows = puzzles.map(puzzle =>
			this.markdownTableFactory.tableRowNode([
				this.markdownTableFactory.textTableCellNode(puzzle.name),
				this.markdownTableFactory.imageTableCellNode(puzzle.imageLink, 100),
				this.markdownTableFactory.textTableCellNode(puzzle.status)
			])
		);
		const table = this.markdownTableFactory.table(headerRow, puzzleRows);

		return this.markdownTableConverter.tableToString(table);
	}

	#markdownTableStringToPuzzles(markdownTableString: string): IQPuzzle[] {
		const arrayOfArrays = this.markdownTableConverter.arrayOfArraysFromString(markdownTableString);
		const imageLinkRegex = new RegexFactory().imageMarkdownLinkRegex();

		return arrayOfArrays.slice(1).flatMap(array => {
			if (array.length < IQPuzzlesRecipe.#HEADERS.length) {
				return [];
			}

			const name = array[0];

			const image = array[1];
			const imageLinkMatches = Array.from(image.matchAll(imageLinkRegex));
			const imageLinkMatch = imageLinkMatches[0];
			if (imageLinkMatch == undefined || imageLinkMatch == null || imageLinkMatch.groups == null) {
				return [];
			}
			const imageLink = imageLinkMatch.groups.link;

			const status = array[2];

			return new IQPuzzle(name, imageLink, status);
		});
	}
}
