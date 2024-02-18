import { Recipe } from '../Recipe';

export class IQPuzzlesRecipe implements Recipe {
	static NAME = 'IQ Puzzles';
	static WEBPAGE = 'https://www.iqpuzzle.com';

	async updatedListInContent(content: string): Promise<string> {
		return content;
	}
}
