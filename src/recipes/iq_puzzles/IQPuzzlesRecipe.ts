import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { NameAndImageRecipe } from '../name_and_image/NameAndImageRecipe';
import { Recipe } from '../Recipe';
import { IQPuzzle } from './IQPuzzle';

export class IQPuzzlesRecipe implements Recipe {
	static readonly NAME = 'IQ Puzzles';
	static readonly WEBPAGE = 'https://www.iqpuzzle.com';

	static readonly #SCRAPE_URL = 'https://www.iqpuzzle.com';

	private readonly recipe;

	constructor(
		markdownTableFactory: MarkdownTableFactory,
		markdownTableConverter: MarkdownTableConverter,
		trackablesUpdater: TrackablesUpdater
	) {
		const nameRegex = new RegExp(/• (?<name>[\w\s]+?)\s*$/); // https://regex101.com/r/AuK9pb/4
		const invalidPuzzleNames = [
			'№1 Haosul Îndărătnic Set 7in1',
			'№2 Haosul Îndărătnic Set 7in1'
		];
		const cleanedLinkRegex = new RegExp(/^(?<cleanedLink>.+?\.jpg)/); // https://regex101.com/r/fd3A6U/1

		this.recipe = new NameAndImageRecipe<IQPuzzle>(
			IQPuzzlesRecipe.NAME,
			[IQPuzzlesRecipe.#SCRAPE_URL],
			markdownTableFactory,
			markdownTableConverter,
			trackablesUpdater,
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

				if (invalidPuzzleNames.includes(title)) {
					return null;
				}

				const titleMatch = title.match(nameRegex);
				const titleGroups = titleMatch?.groups;

				const name = titleGroups?.name ?? title;

				const image = product.querySelector('a wow-image img');
				const imageLink = image != null ? (image as HTMLImageElement).src : '';
				const cleanedImageLinkMatch = imageLink.match(cleanedLinkRegex);
				const cleanedImageLink = (cleanedImageLinkMatch != null && cleanedImageLinkMatch.groups != null)
					? cleanedImageLinkMatch.groups.cleanedLink
					: '';

				return new IQPuzzle(name, cleanedImageLink);
			},
			(name, imageLink, status) => {
				return new IQPuzzle(name, imageLink, status);
			}
		);
	}

	updatedListInContent(content: string): Promise<string> {
		return this.recipe.updatedListInContent(content);
	}
}
