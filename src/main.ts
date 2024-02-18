import { Notice, Plugin } from 'obsidian';
import { HanayamaHuzzlesRecipe } from './recipes/hanayama_huzzles/HanayamaHuzzlesRecipe';

export default class TrackALotPlugin extends Plugin {
	async onload() {
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
