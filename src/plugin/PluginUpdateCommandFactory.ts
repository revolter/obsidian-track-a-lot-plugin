import { Command, Notice } from 'obsidian';
import { Recipe } from 'src/recipes/Recipe';

export class PluginUpdateCommandFactory {
	command(name: string, recipe: Recipe): Command {
		return {
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
		};
	}

	#identifier(name: string): string {
		return name.toLowerCase().replace(' ', '-');
	}
}
