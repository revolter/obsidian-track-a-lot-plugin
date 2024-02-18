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

		new Setting(this.containerEl)
			.setDesc(this.#createFragment(
				this.#createTextElement('span', '⚠️ Due to Obsidian Plugin limitations, you have to disable and re-enable the plugin from '),
				this.#createTextElement('code', 'Settings > Community plugins > Installed plugins'),
				this.#createTextElement('span', ' after toggling any recipe!')
			));

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

	#createTextElement<K extends keyof HTMLElementTagNameMap>(type: K, text: string): HTMLElementTagNameMap[K] {
		return this.containerEl.createEl(type, { text: text });
	}

	#createFragment(...elements: HTMLElement[]): DocumentFragment {
		const fragment = new DocumentFragment();
		fragment.append(...elements);

		return fragment;
	}
}
