import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/IQPuzzlesRecipeSettings';

export interface RecipesPluginSettings {
	hanayamaHuzzles: HanayamaHuzzlesRecipeSettings;
	iqPuzzles: IQPuzzlesRecipeSettings;
}
