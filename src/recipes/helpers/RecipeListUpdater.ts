import { Trackable } from 'src/tracking/Trackable';
import { TrackablesUpdater } from 'src/tracking/TrackablesUpdater';
import { RecipeMarkdownListUpdater } from './RecipeMarkdownListUpdater';

export class RecipeListUpdater<RecipeItem extends Trackable> {
	constructor(
		private headers: readonly string[],
		private recipeMarkdownListUpdater: RecipeMarkdownListUpdater,
		private trackablesUpdater: TrackablesUpdater
	) {}

	async update(
		content: string,
		markdownTableStringToTrackables: (markdownTableString: string) => RecipeItem[],
		scrapeTrackables: () => Promise<RecipeItem[]>,
		trackablesToMarkdownTableString: (headers: readonly string[], trackables: RecipeItem[]) => string
	): Promise<string> {
		return this.recipeMarkdownListUpdater.update(content, async markdownList => {
			const currentTrackables = markdownList != null ? markdownTableStringToTrackables(markdownList) : [];
			const newTrackables = await scrapeTrackables();
			const updatedTrackables = this.trackablesUpdater.updatedTrackables(currentTrackables, newTrackables);

			return trackablesToMarkdownTableString(this.headers, updatedTrackables);
		});
	}
}
