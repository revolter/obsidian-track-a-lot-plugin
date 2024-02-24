import { Plugin } from 'obsidian';
import { MarkdownTableConverter } from './markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from './markdown/MarkdownTableFactory';
import { PluginUpdateCommandFactory } from './plugin/PluginUpdateCommandFactory';
import { Recipe } from './recipes/Recipe';
import { HanayamaHuzzlesRecipe } from './recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { IQPuzzlesRecipe } from './recipes/iq_puzzles/IQPuzzlesRecipe';
import { RecipesSettingsTab } from './settings/RecipesSettingsTab';
import { SettingsManager } from './settings/SettingsManager';
import { TrackablesUpdater } from './tracking/TrackablesUpdater';

export default class TrackALotPlugin extends Plugin {
	async onload() {
		const settingsManager = new SettingsManager(this);
		await settingsManager.loadSettings();

		const settingsTab = new RecipesSettingsTab(this.app, this, settingsManager);
		this.addSettingTab(settingsTab);

		const markdownTableFactory = new MarkdownTableFactory();
		const markdownTableConverter = new MarkdownTableConverter();
		const trackablesUpdater = new TrackablesUpdater();

		if (settingsManager.settings.hanayamaHuzzles.isActive) {
			this.#addCommand(HanayamaHuzzlesRecipe.NAME, new HanayamaHuzzlesRecipe(
				markdownTableFactory,
				markdownTableConverter,
				trackablesUpdater
			));
		}

		if (settingsManager.settings.iqPuzzles.isActive) {
			this.#addCommand(IQPuzzlesRecipe.NAME, new IQPuzzlesRecipe(
				markdownTableFactory,
				markdownTableConverter,
				trackablesUpdater
			));
		}
	}

	onunload() {}

	#addCommand(name: string, recipe: Recipe) {
		const factory = new PluginUpdateCommandFactory();

		this.addCommand(factory.command(name, recipe));
	}
}
