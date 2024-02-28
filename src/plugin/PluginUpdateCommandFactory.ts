import { Command, Notice } from 'obsidian';
import { Recipe } from 'src/recipes/Recipe';
import { RecipeSettingsToggleable } from 'src/settings/data/RecipeSettingsToggleable';

export class PluginUpdateCommandFactory {
	command(name: string, recipe: Recipe, settings: RecipeSettingsToggleable): Command {
		return {
			id: this.#identifier(`update-${name}-list`),
			name: `Update ${name} list`,
			editorCheckCallback: (checking, editor, _ctx) => {
				const isActive = settings.isActive;

				if (!isActive) {
					return false;
				}

				if (!checking) {
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

				return true;
			}
		};
	}

	#identifier(name: string): string {
		return name.toLowerCase().replace(' ', '-');
	}
}
