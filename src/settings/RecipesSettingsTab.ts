import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { SettingsManager } from './SettingsManager';

export class RecipesSettingsTab extends PluginSettingTab {
	constructor(app: App, plugin: Plugin, private settingsManager: SettingsManager) {
		super(app, plugin);
	}

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName('Recipes')
			.setHeading();

		const hanayamaHuzzlesWebpageLink = this.#createDescriptionLink(HanayamaHuzzlesRecipe.WEBPAGE);
		new Setting(this.containerEl)
			.setName(HanayamaHuzzlesRecipe.NAME)
			.setDesc(this.#createFragment(hanayamaHuzzlesWebpageLink))
			.addToggle(toggle => {
				return toggle
					.setValue(this.settingsManager.settings.hanayamaHuzzles)
					.onChange(async (value) => {
						this.settingsManager.settings.hanayamaHuzzles = value;
						await this.settingsManager.saveSettings();
					});
			});
	}

	#createDescriptionLink(url: string): HTMLAnchorElement {
		return this.containerEl.createEl('a', { cls: 'setting-item-description', href: url, text: url});
	}

	#createFragment(element: HTMLElement): DocumentFragment {
		const fragment = new DocumentFragment();
		fragment.append(element);

		return fragment;
	}
}
