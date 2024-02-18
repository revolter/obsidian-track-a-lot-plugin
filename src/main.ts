import { Notice, Plugin } from 'obsidian';
import { Recipe } from './recipes/Recipe';
import { HanayamaHuzzlesRecipe } from './recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { RecipesSettingsTab } from './settings/RecipesSettingsTab';
import { SettingsManager } from './settings/SettingsManager';

export default class TrackALotPlugin extends Plugin {
	async onload() {
		const settingsManager = new SettingsManager(this);
		await settingsManager.loadSettings();

		const settingsTab = new RecipesSettingsTab(this.app, this, settingsManager);
		this.addSettingTab(settingsTab);

		if (settingsManager.settings.hanayamaHuzzles) {
			this.#addCommand(HanayamaHuzzlesRecipe.NAME, new HanayamaHuzzlesRecipe());
		}
	}

	onunload() {}

	#addCommand(name: string, recipe: Recipe) {
		this.addCommand({
			id: this.#identifier(`update-${name}-list`),
			name: `Update ${name} list`,
			editorCallback: (editor, _view) => {
				const content = editor.getValue();

				new Notice(`${name} list update started`);
				const startDate = new Date();

				recipe.updatedListInContent(content).then( newContent => {
					editor.setValue(newContent);

					const endDate = new Date();
					const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
					new Notice(`${name} list update finished in ${seconds} seconds`);
				});
			}
		});
	}

	#identifier(name: string): string {
		return name.toLowerCase().replace(' ', '-');
	}
}
