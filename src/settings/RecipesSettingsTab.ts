import { App, Plugin, PluginSettingTab } from 'obsidian';
import 'src/html/HTMLElementExtensions';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { IQPuzzlesRecipe } from 'src/recipes/iq_puzzles/IQPuzzlesRecipe';
import { RecipeSettingsAdder } from './RecipeSettingsAdder';
import { SettingsAdder } from './SettingsAdder';
import { SettingsManager } from './SettingsManager';
import { RecipesPluginSettings } from './data/RecipesPluginSettings';

export class RecipesSettingsTab extends PluginSettingTab {
	constructor(readonly app: App, readonly plugin: Plugin, private settingsManager: SettingsManager) {
		super(app, plugin);
	}

	display(): void {
		this.containerEl.empty();

		const settingsAdder = new SettingsAdder(this.containerEl);

		settingsAdder
			.add('Recipes')
			.setHeading();

		settingsAdder.add(
			'',
			this.containerEl.createFragment(
				this.containerEl.createText('span', '⚠️ Due to Obsidian Plugin limitations, you have to disable and re-enable the plugin from '),
				this.containerEl.createText('code', 'Settings > Community plugins > Installed plugins'),
				this.containerEl.createText('span', ' after toggling any recipe!')
			)
		);

		const settings = this.settingsManager.settings;

		this.#addHanayamaHuzzlesSettings(settings, settingsAdder);
		this.#addIQPuzzlesSettings(settings, settingsAdder);
	}

	#addHanayamaHuzzlesSettings(settings: RecipesPluginSettings, settingsAdder: SettingsAdder) {
		const hanayamaHuzzlesRecipeSettingsAdder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		hanayamaHuzzlesRecipeSettingsAdder.add(HanayamaHuzzlesRecipe.NAME, HanayamaHuzzlesRecipe.WEBPAGE);
		hanayamaHuzzlesRecipeSettingsAdder.activate(
			() => { return settings.hanayamaHuzzles.isActive; },
			async value => {
				settings.hanayamaHuzzles.isActive = value;
				await this.settingsManager.saveSettings();
			}
		);
	}

	#addIQPuzzlesSettings(settings: RecipesPluginSettings, settingsAdder: SettingsAdder) {
		const iqPuzzlesRecipeSettingsAdder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		iqPuzzlesRecipeSettingsAdder.add(IQPuzzlesRecipe.NAME, IQPuzzlesRecipe.WEBPAGE);
		iqPuzzlesRecipeSettingsAdder.activate(
			() => { return settings.iqPuzzles.isActive; },
			async value => {
				settings.iqPuzzles.isActive = value;
				await this.settingsManager.saveSettings();
			}
		);
	}
}
