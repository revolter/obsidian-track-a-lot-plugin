import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { NameAndImageRecipe } from '../name_and_image/NameAndImageRecipe';
import { Recipe } from '../Recipe';
import { GelateriaLaRomanaDel1947Gelato } from './GelateriaLaRomanaDel1947Gelato';

export class GelateriaLaRomanaDel1947GelatiRecipe implements Recipe {
	static readonly NAME = 'Gelateria La Romana dal 1947 Gelati';
	static readonly WEBPAGE = 'https://www.gelateriaromana.com';

	static readonly #SCRAPE_URLS = [
		'https://www.gelateriaromana.com/en/cat0_6657-the-tastes-of-tradition.php',
		'https://www.gelateriaromana.com/en/cat0_6657-the-tastes-of-tradition.php?pg=2',
		'https://www.gelateriaromana.com/en/cat0_6657-the-tastes-of-tradition.php?pg=3'
	];

	private readonly recipe;

	constructor(
		markdownTableFactory: MarkdownTableFactory,
		markdownTableConverter: MarkdownTableConverter,
		trackablesUpdater: TrackablesUpdater
	) {
		this.recipe = new NameAndImageRecipe<GelateriaLaRomanaDel1947Gelato>(
			GelateriaLaRomanaDel1947GelatiRecipe.NAME,
			GelateriaLaRomanaDel1947GelatiRecipe.#SCRAPE_URLS,
			markdownTableFactory,
			markdownTableConverter,
			trackablesUpdater,
			content => {
				return Array.from(content.querySelectorAll('#catElencoProdotti .cat_riqProdotto'));
			},
			product => {
				const title = product.querySelector('.riquadri_titolo_content .cat-linkprod')?.textContent;

				if (title == null) {
					return null;
				}

				const name = title;

				const image = product.querySelector('.riquadri_foto .cat-linkprod img');
				const imageLink = image != null ? (image as HTMLImageElement).src : '';

				return new GelateriaLaRomanaDel1947Gelato(name, imageLink);
			},
			(name, imageLink, status) => {
				return new GelateriaLaRomanaDel1947Gelato(name, imageLink, status);
			}
		);
	}

	updatedListInContent(content: string): Promise<string> {
		return this.recipe.updatedListInContent(content);
	}
}
