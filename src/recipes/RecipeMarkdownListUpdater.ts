import dedent from 'dedent';
import { RecipeMarkdownListExtractor } from './RecipeMarkdownListExtractor';
import { RecipeMarker } from './RecipeMarker';

export class RecipeMarkdownListUpdater {
	constructor(private marker: RecipeMarker) {}

	async update(content: string, amend: (markdownList: string | null) => Promise<string>) {
		const markdownListExtractor = new RecipeMarkdownListExtractor(this.marker);
		const markdownList = markdownListExtractor.extract(content);
		const updatedMarkdownList = await amend(markdownList);

		if (markdownList != null) {
			return content.replace(markdownListExtractor.regex, updatedMarkdownList);
		} else {
			return dedent`
				${content}

				${updatedMarkdownList}
			`;
		}
	}
}
