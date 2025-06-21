import { Plugin } from 'obsidian';
import { MarkdownTableConverter } from './markdown/MarkdownTableConverter';
import { MarkdownTableFactory } from './markdown/MarkdownTableFactory';
import { PluginUpdateCommandFactory } from './plugin/PluginUpdateCommandFactory';
import { EisKaltIceCreamsRecipe } from './recipes/eis_kalt_ice_creams/EisKaltIceCreamsRecipe';
import { GelateriaLaRomanaDel1947GelatiRecipe } from './recipes/gelateria_la_romana_dal_1947_gelati/GelateriaLaRomanaDel1947GelatiRecipe';
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
			const command = commandFactory.command(
				HanayamaHuzzlesRecipe.NAME,
				new HanayamaHuzzlesRecipe(
					markdownTableFactory,
					markdownTableConverter,
					trackablesUpdater,
					settingsManager.settings.hanayamaHuzzles
				),
				settingsManager.settings.hanayamaHuzzles
			);

			this.addCommand(command);
		}

		if (settingsManager.settings.iqPuzzles.isActive) {
			const command = commandFactory.command(
				IQPuzzlesRecipe.NAME,
				new IQPuzzlesRecipe(
					markdownTableFactory,
					markdownTableConverter,
					trackablesUpdater
				),
				settingsManager.settings.iqPuzzles
			);

			this.addCommand(command);
		}

		if (settingsManager.settings.gelateriaLaRomanaDel1947Gelati.isActive) {
			const command = commandFactory.command(
				GelateriaLaRomanaDel1947GelatiRecipe.NAME,
				new GelateriaLaRomanaDel1947GelatiRecipe(
					markdownTableFactory,
					markdownTableConverter,
					trackablesUpdater
				),
				settingsManager.settings.gelateriaLaRomanaDel1947Gelati
			);

			this.addCommand(command);
		}

		if (settingsManager.settings.eisKaltIceCreams.isActive) {
			const command = commandFactory.command(
				EisKaltIceCreamsRecipe.NAME,
				new EisKaltIceCreamsRecipe(
					markdownTableFactory,
					markdownTableConverter,
					trackablesUpdater
				),
				settingsManager.settings.eisKaltIceCreams
			);

			this.addCommand(command);
		}
	}

	onunload() {}
}
