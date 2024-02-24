import { Plugin } from 'obsidian';
import { MarkdownTableConverter } from './markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from './markdown/MarkdownTableFactory';
import { PluginUpdateCommandFactory } from './plugin/PluginUpdateCommandFactory';
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
		const commandFactory = new PluginUpdateCommandFactory();

		if (settingsManager.settings.hanayamaHuzzles.isActive) {
			const command = commandFactory.command(HanayamaHuzzlesRecipe.NAME, new HanayamaHuzzlesRecipe(
				markdownTableFactory,
				markdownTableConverter,
				trackablesUpdater
			));

			this.addCommand(command);
		}

		if (settingsManager.settings.iqPuzzles.isActive) {
			const command = commandFactory.command(IQPuzzlesRecipe.NAME, new IQPuzzlesRecipe(
				markdownTableFactory,
				markdownTableConverter,
				trackablesUpdater
			));

			this.addCommand(command);
		}
	}

	onunload() {}
}
