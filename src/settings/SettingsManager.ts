import { Plugin } from 'obsidian';
import { EisKaltIceCreamsRecipeSettings } from 'src/recipes/eis_kalt_ice_creams/EisKaltIceCreamsRecipeSettings';
import { GelateriaLaRomanaDel1947GelatiRecipeSettings } from 'src/recipes/gelateria_la_romana_dal_1947_gelati/GelateriaLaRomanaDel1947GelatiRecipeSettings';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/IQPuzzlesRecipeSettings';
import { RecipesSettings } from './data/RecipesSettings';

export class SettingsManager {
	static readonly #DEFAULT_SETTINGS: Partial<RecipesSettings> = {
		hanayamaHuzzles: new HanayamaHuzzlesRecipeSettings(),
		iqPuzzles: new IQPuzzlesRecipeSettings(),
		gelateriaLaRomanaDel1947Gelati: new GelateriaLaRomanaDel1947GelatiRecipeSettings(),
		eisKaltIceCreams: new EisKaltIceCreamsRecipeSettings()
	};

	settings: RecipesSettings;

	constructor(private plugin: Plugin) {}

	async loadSettings() {
		this.settings = Object.assign({}, SettingsManager.#DEFAULT_SETTINGS, await this.plugin.loadData());
	}

	async saveSettings() {
		await this.plugin.saveData(this.settings);
	}
}
