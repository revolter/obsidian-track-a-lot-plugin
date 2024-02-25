import { App, Plugin, PluginSettingTab } from 'obsidian';
import 'src/html/HTMLElementExtensions';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { HanayamaHuzzlesRecipeExtraSettingsAdder } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeExtraSettingsAdder';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipe } from 'src/recipes/iq_puzzles/IQPuzzlesRecipe';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/settings/IQPuzzlesRecipeSettings';
import { RecipeSettingsAdder } from './RecipeSettingsAdder';
import { SettingsAdder } from './SettingsAdder';
import { SettingsManager } from './SettingsManager';

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

		this.#addHanayamaHuzzlesSettings(settings.hanayamaHuzzles, settingsAdder);
		this.#addIQPuzzlesSettings(settings.iqPuzzles, settingsAdder);
	}

	#addHanayamaHuzzlesSettings(settings: HanayamaHuzzlesRecipeSettings, settingsAdder: SettingsAdder) {
		const hanayamaHuzzlesRecipeSettingsAdder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		hanayamaHuzzlesRecipeSettingsAdder.add(HanayamaHuzzlesRecipe.NAME, HanayamaHuzzlesRecipe.WEBPAGE);

		const extraSettingsAdder = new HanayamaHuzzlesRecipeExtraSettingsAdder(this.containerEl, settingsAdder, settings);
		const extraSettings = extraSettingsAdder.add();

		hanayamaHuzzlesRecipeSettingsAdder.activate(
			() => { return settings.isActive; },
			async value => {
				settings.isActive = value;

				extraSettings.forEach(setting => {
					setting.setDisabled(!value);
				});

				await this.settingsManager.saveSettings();
			}
		);

		extraSettingsAdder.activate(async () => { await this.settingsManager.saveSettings(); });
	}

	#addIQPuzzlesSettings(settings: IQPuzzlesRecipeSettings, settingsAdder: SettingsAdder) {
		const iqPuzzlesRecipeSettingsAdder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		iqPuzzlesRecipeSettingsAdder.add(IQPuzzlesRecipe.NAME, IQPuzzlesRecipe.WEBPAGE);
		iqPuzzlesRecipeSettingsAdder.activate(
			() => { return settings.isActive; },
			async value => {
				settings.isActive = value;
				await this.settingsManager.saveSettings();
			}
		);
	}
}
