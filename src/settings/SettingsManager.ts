import { Plugin } from 'obsidian';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/settings/IQPuzzlesRecipeSettings';
import { RecipesSettings } from './data/RecipesSettings';

export class SettingsManager {
	static readonly #DEFAULT_SETTINGS: Partial<RecipesSettings> = {
		hanayamaHuzzles: new HanayamaHuzzlesRecipeSettings(),
		iqPuzzles: new IQPuzzlesRecipeSettings()
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
