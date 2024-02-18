import { Notice, Plugin } from 'obsidian';
import { HanayamaHuzzlesRecipe } from './recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';
import { RecipesSettingsTab } from './settings/RecipesSettingsTab';
import { SettingsManager } from './settings/SettingsManager';

export default class TrackALotPlugin extends Plugin {
	async onload() {
		const settingsManager = new SettingsManager(this);
		await settingsManager.loadSettings();

		const settingsTab = new RecipesSettingsTab(this.app, this, settingsManager);
		this.addSettingTab(settingsTab);

		this.addCommand({
			id: 'update-list',
			name: 'Update list',
			editorCallback: (editor, _view) => {
				const content = editor.getValue();

				new Notice('List update started');
				const startDate = new Date();

				const hanayamaHuzzlesRecipe = new HanayamaHuzzlesRecipe();
				hanayamaHuzzlesRecipe.updatedListInContent(content).then( newContent => {
					editor.setValue(newContent);

					const endDate = new Date();
					const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
					new Notice(`List update finished in ${seconds} seconds`);
				});
			}
		});
	}

	onunload() {}
}
