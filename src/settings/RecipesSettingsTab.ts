import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import 'src/html/HTMLElementExtensions';
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
			.setDesc(this.containerEl.createFragment(
				this.containerEl.createText('span', '⚠️ Due to Obsidian Plugin limitations, you have to disable and re-enable the plugin from '),
				this.containerEl.createText('code', 'Settings > Community plugins > Installed plugins'),
				this.containerEl.createText('span', ' after toggling any recipe!')
			));

		const settings = this.settingsManager.settings;

		this.#addToggle(
			HanayamaHuzzlesRecipe.NAME,
			HanayamaHuzzlesRecipe.WEBPAGE,
			() => { return settings.hanayamaHuzzles.isActive; },
			value => { settings.hanayamaHuzzles.isActive = value; }
		);

		this.#addToggle(
			IQPuzzlesRecipe.NAME,
			IQPuzzlesRecipe.WEBPAGE,
			() => { return settings.iqPuzzles.isActive; },
			value => { settings.iqPuzzles.isActive = value; }
		);
	}

	#addToggle(
		name: string,
		webpage: string,
		getter: () => boolean,
		setter: (value: boolean) => void
	) {
		const webpageLink = this.containerEl.createLink(webpage, { cls: 'setting-item-description' });

		new Setting(this.containerEl)
			.setName(name)
			.setDesc(this.containerEl.createFragment(webpageLink))
			.addToggle(toggle => {
				return toggle
					.setValue(getter())
					.onChange(async (value) => {
						setter(value);
						await this.settingsManager.saveSettings();
					});
			});
	}
}
