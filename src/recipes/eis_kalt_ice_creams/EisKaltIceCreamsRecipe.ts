import { MarkdownTableConverter } from 'src/markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from 'src/markdown/MarkdownTableFactory';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { NameAndImageRecipe } from '../name_and_image/NameAndImageRecipe';
import { Recipe } from '../Recipe';
import { EisKaltIceCream } from './EisKaltIceCream';

export class EisKaltIceCreamsRecipe implements Recipe {
	static readonly NAME = 'Eis[kalt] Ice Creams';
	static readonly WEBPAGE = 'https://inghetata-brasov.ro';

	static readonly #SCRAPE_URL = 'https://inghetata-brasov.ro/inghetata-noastra/';

	private readonly recipe;

	constructor(
		markdownTableFactory: MarkdownTableFactory,
		markdownTableConverter: MarkdownTableConverter,
		trackablesUpdater: TrackablesUpdater
	) {
		this.recipe = new NameAndImageRecipe<EisKaltIceCream>(
			EisKaltIceCreamsRecipe.NAME,
			[EisKaltIceCreamsRecipe.#SCRAPE_URL],
			markdownTableFactory,
			markdownTableConverter,
			trackablesUpdater,
			content => {
				return Array.from(content.querySelectorAll('.full_width_inner .vc_column_container.vc_col-sm-4'));
			},
			product => {
				const title = product.querySelector('.wpb_text_column h2')?.textContent;

				if (title == null) {
					return null;
				}

				const name = title;

				const image = product.querySelector('.wpb_single_image .vc_single_image-img');
				const imageLink = image != null ? (image as HTMLImageElement).src : '';

				return new EisKaltIceCream(name, imageLink);
			},
			(name, imageLink, status) => {
				return new EisKaltIceCream(name, imageLink, status);
			}
		);
	}

	updatedListInContent(content: string): Promise<string> {
		return this.recipe.updatedListInContent(content);
	}
}
