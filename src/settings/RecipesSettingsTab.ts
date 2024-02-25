import { App, Plugin, PluginSettingTab } from 'obsidian';
import 'src/html/HTMLElementExtensions';
import { HanayamaHuzzlesRecipe } from 'src/recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { IQPuzzlesRecipe } from 'src/recipes/iq_puzzles/IQPuzzlesRecipe';
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

		this.#addToggle(
			HanayamaHuzzlesRecipe.NAME,
			HanayamaHuzzlesRecipe.WEBPAGE,
			settingsAdder,
			() => { return settings.hanayamaHuzzles.isActive; },
			value => { settings.hanayamaHuzzles.isActive = value; }
		);

		this.#addToggle(
			IQPuzzlesRecipe.NAME,
			IQPuzzlesRecipe.WEBPAGE,
			settingsAdder,
			() => { return settings.iqPuzzles.isActive; },
			value => { settings.iqPuzzles.isActive = value; }
		);
	}

	#addToggle(
		name: string,
		webpage: string,
		settingsAdder: SettingsAdder,
		getter: () => boolean,
		setter: (value: boolean) => void
	) {
		this.#addSettingHeader(name, webpage);

		settingsAdder
			.add(
				'Active',
				this.containerEl.createFragment(
					this.containerEl.createText('span', 'Whether this list shows up in the '),
					this.containerEl.createText('code', 'Command palette'),
					this.containerEl.createText('span', ' or not.')
				)
			)
			.addToggle(toggle => {
				return toggle
					.setValue(getter())
					.onChange(async (value) => {
						setter(value);
						await this.settingsManager.saveSettings();
					});
			});
	}

	#addSettingHeader(name: string, webpage: string) {
		this.containerEl.createText('h3', name, { cls: 'no-bottom-margin' });
		this.containerEl.createLink(webpage, { cls: ['setting-item-description', 'default-bottom-margin'] });
	}
}
