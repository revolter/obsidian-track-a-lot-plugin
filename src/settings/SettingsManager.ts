import { Plugin } from 'obsidian';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/IQPuzzlesRecipeSettings';
import { RecipesPluginSettings } from './data/RecipesPluginSettings';

export class SettingsManager {
	static #DEFAULT_SETTINGS: Partial<RecipesPluginSettings> = {
		hanayamaHuzzles: new HanayamaHuzzlesRecipeSettings(),
		iqPuzzles: new IQPuzzlesRecipeSettings()
	};

	settings: RecipesPluginSettings;

	constructor(private plugin: Plugin) {}

	async loadSettings() {
		this.settings = Object.assign({}, SettingsManager.#DEFAULT_SETTINGS, await this.plugin.loadData());
	}

	async saveSettings() {
		await this.plugin.saveData(this.settings);
	}
}
