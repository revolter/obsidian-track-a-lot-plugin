import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { RegexFactory } from 'src/regex/RegexFactory';
import { WebsiteScraper } from 'src/scraping/WebsiteScraper';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { Recipe } from '../Recipe';
import { RecipeListUpdater } from '../helpers/RecipeListUpdater';
import { RecipeMarkdownListUpdater } from '../helpers/RecipeMarkdownListUpdater';
import { RecipeMarker } from '../helpers/RecipeMarker';
import { NameAndImage } from '../name_and_image/NameAndImage';

export class NameAndImageRecipe<ParsedElement extends NameAndImage> implements Recipe {
	static readonly #HEADERS: readonly string[] = ['Name', 'Picture', 'Status'];

	#marker = new RecipeMarker(this.name);

	constructor(
		private name: string,
		private scrapeURL: string,
		private markdownTableFactory: MarkdownTableFactory,
		private markdownTableConverter: MarkdownTableConverter,
		private trackablesUpdater: TrackablesUpdater,
		private parseContent: (content: Document) => Element[],
		private parseProduct: (product: Element) => ParsedElement | null,
		private constructProduct: (name: string, imageLink: string, status?: string) => ParsedElement
	) {}

	async updatedListInContent(content: string): Promise<string> {
		const markdownUpdater = new RecipeMarkdownListUpdater(this.#marker);
		const updater = new RecipeListUpdater<NameAndImage>(
			NameAndImageRecipe.#HEADERS,
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

	async #scrapePuzzles(): Promise<ParsedElement[]> {
		const scraper = new WebsiteScraper([{
			url: this.scrapeURL
		}]);

		return await scraper.scrape(
			this.parseContent,
			this.parseProduct
		);
	}

	#puzzlesToMarkdownTableString(headers: string[], puzzles: ParsedElement[]): string {
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

	#markdownTableStringToPuzzles(markdownTableString: string): ParsedElement[] {
		const arrayOfArrays = this.markdownTableConverter.arrayOfArraysFromString(markdownTableString);
		const imageLinkRegex = new RegexFactory().imageMarkdownLinkRegex();

		return arrayOfArrays.slice(1).flatMap(array => {
			if (array.length < NameAndImageRecipe.#HEADERS.length) {
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

			return this.constructProduct(name, imageLink, status);
		});
	}
}
