import { GelateriaLaRomanaDel1947GelatiRecipeSettings } from 'src/recipes/gelateria_la_romana_dal_1947_gelati/GelateriaLaRomanaDel1947GelatiRecipeSettings';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/IQPuzzlesRecipeSettings';

export interface RecipesSettings {
	hanayamaHuzzles: HanayamaHuzzlesRecipeSettings;
	iqPuzzles: IQPuzzlesRecipeSettings;
	gelateriaLaRomanaDel1947Gelati: GelateriaLaRomanaDel1947GelatiRecipeSettings;
}
