import { RecipeMarker } from './RecipeMarker';

export class RecipeMarkdownListExtractor {
	constructor(private marker: RecipeMarker) {}

	get regex(): RegExp { return new RegExp(`${this.marker.regexEscapedStart}(?<markdownList>.*?)${this.marker.regexEscapedEnd}`, 's'); }

	extract(content: string): string | null {
		const match = content.match(this.regex);

		if (match == null) {
			return null;
		}

		if (match.groups == null) {
			return null;
		}

		return match.groups.markdownList;
	}
}
