import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import 'src/html/HTMLElementExtensions';
import { GelateriaLaRomanaDel1947GelatiRecipe } from 'src/recipes/gelateria_la_romana_dal_1947_gelati/GelateriaLaRomanaDel1947GelatiRecipe';
import { GelateriaLaRomanaDel1947GelatiRecipeSettings } from 'src/recipes/gelateria_la_romana_dal_1947_gelati/GelateriaLaRomanaDel1947GelatiRecipeSettings';
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
		this.#addGelateriaLaRomanaDel1947GelatiSettings(settings.gelateriaLaRomanaDel1947Gelati, settingsAdder);
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
		const adder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		adder.add(IQPuzzlesRecipe.NAME, IQPuzzlesRecipe.WEBPAGE);
		adder.activate(
			() => { return settings.isActive; },
			async value => {
				settings.isActive = value;
				await this.settingsManager.saveSettings();
			}
		);
	}

	#addGelateriaLaRomanaDel1947GelatiSettings(settings: GelateriaLaRomanaDel1947GelatiRecipeSettings, settingsAdder: SettingsAdder) {
		const adder = new RecipeSettingsAdder(this.containerEl, settingsAdder);
		adder.add(GelateriaLaRomanaDel1947GelatiRecipe.NAME, GelateriaLaRomanaDel1947GelatiRecipe.WEBPAGE);
		adder.activate(
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
