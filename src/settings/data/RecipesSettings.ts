import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/settings/IQPuzzlesRecipeSettings';

export interface RecipesSettings {
	hanayamaHuzzles: HanayamaHuzzlesRecipeSettings;
	iqPuzzles: IQPuzzlesRecipeSettings;
}
