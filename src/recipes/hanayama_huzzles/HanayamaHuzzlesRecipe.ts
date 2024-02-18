import dedent from 'dedent';
import escapeStringRegExp from 'escape-string-regexp';
import { Image, PhrasingContent, Table, TableCell, TableRow, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { requestUrl } from 'obsidian';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';
import { Root } from 'remark-gfm/lib';
import { HanayamaHuzzle } from './HanayamaHuzzle';

export class HanayamaHuzzlesRecipe {
	static #startMarker = '<!-- Hanayama Huzzles start -->';
	static #endMarker = '<!-- Hanayama Huzzles end -->';
	static #headers = ['Level', 'Index', 'Name', 'Picture', 'Status'];
	static #scrapeUrls = [
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-1-fun',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-2-easy',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-3-normal',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-4-hard',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-5-expert',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/level-6-grand-master',
		'https://hanayama-toys.com/product-category/puzzles/huzzle/chess-puzzle'
	]

	async updatedListInContent(content: string): Promise<string> {
		const escapedStartMarker = escapeStringRegExp(HanayamaHuzzlesRecipe.#startMarker);
		const escapedEndMarker = escapeStringRegExp(HanayamaHuzzlesRecipe.#endMarker);

		const regex = new RegExp(`${escapedStartMarker}(?<markdownList>.*?)${escapedEndMarker}`, 's');
		const match = content.match(regex);

		if (match != null && match.groups != null) {
			const markdownList = match.groups.markdownList;
			const currentHuzzles = this.#markdownTableToHuzzles(markdownList);
			const updatedMarkdownList = await this.#updatedHuzzles(currentHuzzles);

			return content.replace(regex, updatedMarkdownList);
		} else {
			const updatedMarkdownList = await this.#updatedHuzzles([]);

			return dedent`
				${content}

				${updatedMarkdownList}
			`;
		}
	}

	async #updatedHuzzles(currentHuzzles: HanayamaHuzzle[]): Promise<string> {
		const indexedCurrentHuzzles = currentHuzzles.slice(1).reduce((map, huzzle) => {
			map[huzzle.name] = huzzle;

			return map;
		}, {} as {[key: string]: HanayamaHuzzle});

		const huzzles = (await this.#scrapeAllHuzzles()).flat();
		huzzles.forEach( huzzle => {
			const indexedCurrentHuzzle = indexedCurrentHuzzles[huzzle.name];

			if (indexedCurrentHuzzle !== undefined) {
				huzzle.status = indexedCurrentHuzzle.status;

				delete indexedCurrentHuzzles[huzzle.name];
			}
		});

		const withdrawnHuzzles = Object.keys(indexedCurrentHuzzles).map(key => indexedCurrentHuzzles[key]);
		const withdrawnModifiedHuzzles = withdrawnHuzzles.filter(huzzle => huzzle.status !== '');

		const updatedList = this.#huzzlesToMarkdownTableString(HanayamaHuzzlesRecipe.#headers, [...huzzles, ...withdrawnModifiedHuzzles]);

		return dedent`
			${HanayamaHuzzlesRecipe.#startMarker}

			${updatedList}

			${HanayamaHuzzlesRecipe.#endMarker}
		`;
	}

	async #scrapeAllHuzzles(): Promise<HanayamaHuzzle[][]> {
		return await Promise.all(HanayamaHuzzlesRecipe.#scrapeUrls.flatMap(async url => {
			return await this.#scrapeHuzzles(url);
		}));
	}

	async #scrapeHuzzles(url: string): Promise<HanayamaHuzzle[]> {
		const response = await requestUrl(url);
		const content = new DOMParser().parseFromString(response.text, 'text/html');
		const products = Array.from(content.querySelectorAll('#main > .products > .product'));
		const metadataRegex = new RegExp(/\w+[ ](?<level>\d+)-(?<index>\d+)[ ](?<name>.+)/); // https://regex101.com/r/1vGzHd/2

		return products.flatMap(product => {
			const title = product.querySelector('.product-info > .product-title > a')?.textContent || '';
			const titleMatch = title.match(metadataRegex);

			let level: string
			let index: string
			let name: string

			if (titleMatch != null && titleMatch.groups != null) {
				level = titleMatch.groups.level;
				index = titleMatch.groups.index;
				name = titleMatch.groups.name;
			} else {
				level = 'N/A';
				index = 'N/A';
				name = title;
			}

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
		]
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
		}
	}

	#textTableCellNode(text: string): TableCell {
		return this.#tableCellNode([this.#textNode(text)]);
	}

	#tableCellNode(children: PhrasingContent[]): TableCell {
		return {
			type: 'tableCell',
			children: children
		}
	}

	#textNode(text: string): Text {
		return {
			type: 'text',
			value: text
		}
	}

	#imageNode(url: string, size: number): Image {
		return {
			type: 'image',
			alt: `|${size}`,
			url: url
		}
	}

	#interleave<Array extends PhrasingContent, Separator extends PhrasingContent>(array: Array[], separator: Separator) {
		return array.flatMap(element => [separator, element]).slice(1);
	}

	#markdownTableToHuzzles(markdownTableString: string): HanayamaHuzzle[] {
		const ast = remark()
			.use(remarkGFM)
			.parse(markdownTableString);
		const table = ast.children.find(node => node.type === 'table') as Table;
		const arrayOfArrays = table.children.map(row =>
			row.children.map(cell =>
				cell.children.map(child => {
					switch (child.type) {
						case 'image': return `![${child.alt}](${child.url})`
						default: return toString(child)
					}
				}).join('')
			)
		);
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
