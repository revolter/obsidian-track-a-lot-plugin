import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { IQPuzzlesRecipe } from 'src/recipes/iq_puzzles/IQPuzzlesRecipe';
import { SettingsManager } from './SettingsManager';

export class RecipesSettingsTab extends PluginSettingTab {
	constructor(readonly app: App, readonly plugin: Plugin, private settingsManager: SettingsManager) {
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

		const settings = this.settingsManager.settings;

		this.#addToggle(
			HanayamaHuzzlesRecipe.NAME,
			HanayamaHuzzlesRecipe.WEBPAGE,
			() => { return settings.hanayamaHuzzles; },
			value => { settings.hanayamaHuzzles = value; }
		);

		this.#addToggle(
			IQPuzzlesRecipe.NAME,
			IQPuzzlesRecipe.WEBPAGE,
			() => { return settings.iqPuzzles; },
			value => { settings.iqPuzzles = value; }
		);
	}

	#addToggle(name: string, webpage: string, getter: () => boolean, setter: (value: boolean) => void) {
		const webpageLink = this.#createDescriptionLink(webpage);
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(this.#createFragment(webpageLink))
			.addToggle(toggle => {
				return toggle
					.setValue(getter())
					.onChange(async (value) => {
						setter(value);
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
