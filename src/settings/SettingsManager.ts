import { Plugin } from 'obsidian';
import { RecipesPluginSettings } from './RecipesPluginSettings';

export class SettingsManager {
	static #DEFAULT_SETTINGS: Partial<RecipesPluginSettings> = {
		hanayamaHuzzles: false,
		iqPuzzles: false
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
