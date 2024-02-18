import dedent from 'dedent';
import { RecipeMarkdownListExtractor } from './RecipeMarkdownListExtractor';
import { RecipeMarker } from './RecipeMarker';

export class RecipeMarkdownListUpdater {
	constructor(private marker: RecipeMarker) {}

	async update(content: string, amend: (markdownList: string | null) => Promise<string>) {
		const markdownListExtractor = new RecipeMarkdownListExtractor(this.marker);
		const markdownList = markdownListExtractor.extract(content);

		if (markdownList != null) {
			const updatedMarkdownList = await amend(markdownList);

			return content.replace(markdownListExtractor.regex, updatedMarkdownList);
		} else {
			const updatedMarkdownList = await amend(null);

			return dedent`
				${content}

				${updatedMarkdownList}
			`;
		}
	}
}
