import { Image, PhrasingContent, Table, TableCell, TableRow, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';
import { Root } from 'remark-gfm/lib';
import { WebpageDownloader } from 'src/scraping/WebpageDownloader';
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

	async updatedListInContent(content: string): Promise<string> {
		const updater = new RecipeMarkdownListUpdater(this.#marker);

		return updater.update(content, async markdownList => {
			const currentHuzzles = markdownList != null ? this.#markdownTableToHuzzles(markdownList) : [];

			return await this.#updatedHuzzles(currentHuzzles);
		});
	}

	async #updatedHuzzles(currentHuzzles: HanayamaHuzzle[]): Promise<string> {
		const indexedCurrentHuzzles = currentHuzzles.slice(1).reduce((map, huzzle) => {
			map[huzzle.name] = huzzle;

			return map;
		}, {} as {[key: string]: HanayamaHuzzle});

		const huzzles = (await this.#scrapeAllHuzzles()).flat();
		huzzles.forEach( huzzle => {
			const indexedCurrentHuzzle = indexedCurrentHuzzles[huzzle.name];

			if (indexedCurrentHuzzle != null) {
				huzzle.status = indexedCurrentHuzzle.status;

				delete indexedCurrentHuzzles[huzzle.name];
			}
		});

		const withdrawnHuzzles = Object.keys(indexedCurrentHuzzles).map(key => indexedCurrentHuzzles[key]);
		const withdrawnModifiedHuzzles = withdrawnHuzzles.filter(huzzle => huzzle.status !== '');

		return this.#huzzlesToMarkdownTableString(HanayamaHuzzlesRecipe.#HEADERS, [...huzzles, ...withdrawnModifiedHuzzles]);
	}

	async #scrapeAllHuzzles(): Promise<HanayamaHuzzle[][]> {
		return await Promise.all(HanayamaHuzzlesRecipe.#SCRAPE_URLS.flatMap(async url => {
			return await this.#scrapeHuzzles(url);
		}));
	}

	async #scrapeHuzzles(url: string): Promise<HanayamaHuzzle[]> {
		const downloader = new WebpageDownloader(url);
		const content = await downloader.download();
		const products = Array.from(content.querySelectorAll('#main > .products > .product'));
		const metadataRegex = new RegExp(/\w+[ ](?<level>\d+)-(?<index>\d+)[ ](?<name>.+)/); // https://regex101.com/r/1vGzHd/2

		return products.flatMap(product => {
			const title = product.querySelector('.product-info > .product-title > a')?.textContent || '';
			const titleMatch = title.match(metadataRegex);
			const titleGroups = titleMatch?.groups;

			const level = titleGroups != null ? titleGroups.level : 'N/A';
			const index = titleGroups != null ? titleGroups.index : 'N/A';
			const name = titleGroups != null ? titleGroups.name : title;

			const images = product.querySelectorAll('.product-thumb > a > img');
			const imageLinks = Array.from(images, image => (image as HTMLImageElement).src);

			return new HanayamaHuzzle(level, index, name, imageLinks);
		});
	}

	#huzzlesToMarkdownTableString(headers: string[], huzzles: HanayamaHuzzle[]): string {
		const headerRow = this.#tableRowNode(headers.map(header => this.#textTableCellNode(header)));
		const huzzleRows = huzzles.map(huzzle =>
			this.#tableRowNode([
				this.#textTableCellNode(huzzle.level),
				this.#textTableCellNode(huzzle.index),
				this.#textTableCellNode(huzzle.name),
				this.#tableCellNode(
					this.#interleave(
						huzzle.imageLinks.map(imageLink => this.#imageNode(imageLink, 100)),
						this.#textNode(' ')
					)
				),
				this.#textTableCellNode(huzzle.status)
			])
		);
		const tableRows = [
			...[headerRow],
			...huzzleRows
		];
		const table: Table = {
			type: 'table',
			children: tableRows as never // https://stackoverflow.com/a/47219058/865175
		};
		const root: Root = {
			type: 'root',
			children: [table]
		};

		return remark()
			.use(remarkGFM)
			.stringify(root)
			.replace(/\n$/, '');
	}

	#tableRowNode(children: TableCell[]): TableRow {
		return {
			type: 'tableRow',
			children: children
		};
	}

	#textTableCellNode(text: string): TableCell {
		return this.#tableCellNode([this.#textNode(text)]);
	}

	#tableCellNode(children: PhrasingContent[]): TableCell {
		return {
			type: 'tableCell',
			children: children
		};
	}

	#textNode(text: string): Text {
		return {
			type: 'text',
			value: text
		};
	}

	#imageNode(url: string, size: number): Image {
		return {
			type: 'image',
			alt: `|${size}`,
			url: url
		};
	}

	#interleave<Array extends PhrasingContent, Separator extends PhrasingContent>(array: Array[], separator: Separator) {
		return array.flatMap(element => [separator, element]).slice(1);
	}

	#markdownTableToHuzzles(markdownTableString: string): HanayamaHuzzle[] {
		const ast = remark()
			.use(remarkGFM)
			.parse(markdownTableString);
		const table = ast.children.find(node => node.type === 'table') as Table | null;
		const arrayOfArrays = table != null
			? table.children.map(row =>
				row.children.map(cell =>
					cell.children.map(child => {
						switch (child.type) {
							case 'image': return `![${child.alt}](${child.url})`;
							default: return toString(child);
						}
					}).join('')
				)
			)
			: [];
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
