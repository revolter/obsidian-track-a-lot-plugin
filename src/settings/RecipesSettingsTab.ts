import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import 'src/html/HTMLElementExtensions';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { HanayamaHuzzlesRecipeExtraSettingsAdder } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeExtraSettingsAdder';
import { HanayamaHuzzlesRecipeSettings } from 'src/recipes/hanayama_huzzles/settings/HanayamaHuzzlesRecipeSettings';
import { IQPuzzlesRecipe } from 'src/recipes/iq_puzzles/IQPuzzlesRecipe';
import { IQPuzzlesRecipeSettings } from 'src/recipes/iq_puzzles/IQPuzzlesRecipeSettings';
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

				this.#setSettingsEnabled(extraSettings, value);

				await this.settingsManager.saveSettings();
			}
		);

		extraSettingsAdder.activate(async () => { await this.settingsManager.saveSettings(); });

		this.#setSettingsEnabled(extraSettings, settings.isActive);
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

	#setSettingsEnabled(settings: Setting[], enabled: boolean) {
		settings.forEach(setting => {
			setting.setDisabled(!enabled);
		});
	}
}
