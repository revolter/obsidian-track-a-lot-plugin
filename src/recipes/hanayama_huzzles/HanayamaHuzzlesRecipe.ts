import { TableCell } from 'mdast';
import { naturalCompare } from 'src/helpers/NaturalSorter';
import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { RegexFactory } from 'src/regex/RegexFactory';
import { WebsiteScraper } from 'src/scraping/WebsiteScraper';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { Recipe } from '../Recipe';
import { RecipeListUpdater } from '../helpers/RecipeListUpdater';
import { RecipeMarkdownListUpdater } from '../helpers/RecipeMarkdownListUpdater';
import { RecipeMarker } from '../helpers/RecipeMarker';
import { HanayamaHuzzle } from './HanayamaHuzzle';
import { HanayamaHuzzlesRecipeSettings } from './settings/HanayamaHuzzlesRecipeSettings';

interface HanayamaHuzzlesScrapeDataSource {
	url: string;
	level?: string;
}

export class HanayamaHuzzlesRecipe implements Recipe {
	static readonly NAME = 'Hanayama Huzzles';
	static readonly WEBPAGE = 'https://hanayama-toys.com/product-category/puzzles/huzzle';
	static readonly CHESS_PUZZLES_DATA_SOURCE: HanayamaHuzzlesScrapeDataSource = {
		url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/chess-puzzle'
	};

	static readonly #HEADERS: readonly string[] = ['Level', 'Index', 'Name', 'Picture', 'Status'];
	static readonly #SCRAPE_DATA_SOURCES: readonly HanayamaHuzzlesScrapeDataSource[] = [
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-1-fun',
			level: '1',
		},
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-2-easy',
			level: '2',
		},
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-3-normal',
			level: '3',
		},
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-4-hard',
			level: '4',
		},
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-5-expert',
			level: '5',
		},
		{
			url: 'https://hanayama-toys.com/product-category/puzzles/huzzle/level-6-grand-master',
			level: '6',
		}
	];

	#marker = new RecipeMarker(HanayamaHuzzlesRecipe.NAME);

	constructor(
		private markdownTableFactory: MarkdownTableFactory,
		private markdownTableConverter: MarkdownTableConverter,
		private trackablesUpdater: TrackablesUpdater,
		private settings: HanayamaHuzzlesRecipeSettings
	) {}

	async updatedListInContent(content: string): Promise<string> {
		const markdownUpdater = new RecipeMarkdownListUpdater(this.#marker);
		const updater = new RecipeListUpdater<HanayamaHuzzle>(
			HanayamaHuzzlesRecipe.#HEADERS,
			markdownUpdater,
			this.trackablesUpdater
		);

		return await updater.update(
			content,

			this.#markdownTableStringToHuzzles.bind(this),
			this.#scrapeHuzzles.bind(this),
			this.#huzzlesToMarkdownTableString.bind(this)
		);
	}

	async #scrapeHuzzles(): Promise<HanayamaHuzzle[]> {
		const metadataRegex = new RegExp(/\w+[ ]\d+-(?<index>\d+)[ ](?<name>.+)/); // https://regex101.com/r/1vGzHd/3

		const dataSources = [...HanayamaHuzzlesRecipe.#SCRAPE_DATA_SOURCES];
		if (this.settings.includeChessPuzzles) {
			dataSources.push(HanayamaHuzzlesRecipe.CHESS_PUZZLES_DATA_SOURCE);
		}
		const scraper = new WebsiteScraper(
			dataSources.map(dataSource => ({
				url: dataSource.url,
				context: dataSource.level
			}))
		);

		return await scraper.scrape(
			content => {
				return Array.from(content.querySelectorAll('#main > .products > .product'));
			},
			(product, sourceLevel) => {
				const title = product.querySelector('.product-info > .product-title > a')?.textContent;

				if (title == null) {
					return null;
				}

				const titleMatch = title.match(metadataRegex);
				const titleGroups = titleMatch?.groups;

				const level = sourceLevel ?? 'N/A';
				const index = titleGroups != null ? titleGroups.index : 'N/A';
				const name = titleGroups?.name ?? title;

				const images = product.querySelectorAll('.product-thumb > a > img');
				const imageLinks = Array.from(images, image => (image as HTMLImageElement).src);

				return new HanayamaHuzzle(level, index, name, imageLinks);
			}
		);
	}

	#huzzlesToMarkdownTableString(headers: string[], syncedHuzzles: HanayamaHuzzle[], withdrawnModifiedHuzzles: HanayamaHuzzle[]): string {
		const headerRow = this.markdownTableFactory.tableRowNode(
			headers.map(header => this.markdownTableFactory.textTableCellNode(header))
		);
		const huzzleRows = [
			...syncedHuzzles,
			...withdrawnModifiedHuzzles
		]
			.sort((first, second) => {
				const stringToNumber = (string: string) =>
					isNaN(Number(string)) ? Infinity : Number(string);
				const compare = (first: number, second: number) =>
					first < second ? -1 : first > second ? 1 : 0;

				return (
					compare(stringToNumber(first.level), stringToNumber(second.level))
					|| compare(stringToNumber(first.index), stringToNumber(second.index))
					|| naturalCompare(first.name, second.name)
				);
			})
			.map(huzzle => {
				let nameTableCell: TableCell;
				if (withdrawnModifiedHuzzles.includes(huzzle)) {
					nameTableCell = this.markdownTableFactory.deletedTextTableCellNode(huzzle.name);
				} else {
					nameTableCell = this.markdownTableFactory.textTableCellNode(huzzle.name);
				}

				return this.markdownTableFactory.tableRowNode([
					this.markdownTableFactory.textTableCellNode(huzzle.level),
					this.markdownTableFactory.textTableCellNode(huzzle.index),
					nameTableCell,
					this.markdownTableFactory.tableCellNode(
						this.markdownTableFactory.interleave(
							huzzle.imageLinks.map(imageLink => this.markdownTableFactory.imageNode(imageLink, 100)),
							this.markdownTableFactory.textNode(' ')
						)
					),
					this.markdownTableFactory.textTableCellNode(huzzle.status)
				]);
			});
		const table = this.markdownTableFactory.table(headerRow, huzzleRows);

		return this.markdownTableConverter.tableToString(table);
	}

	#markdownTableStringToHuzzles(markdownTableString: string): HanayamaHuzzle[] {
		const arrayOfArrays = this.markdownTableConverter.arrayOfArraysFromString(markdownTableString);
		const imageLinkRegex = new RegexFactory().imageMarkdownLinkRegex();

		return arrayOfArrays.slice(1).flatMap(array => {
			if (array.length < HanayamaHuzzlesRecipe.#HEADERS.length) {
				return [];
			}

			const level = array[0];
			const index = array[1];
			const name = array[2];

			const images = array[3];
			const imageLinkMatches = images.matchAll(imageLinkRegex);
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
