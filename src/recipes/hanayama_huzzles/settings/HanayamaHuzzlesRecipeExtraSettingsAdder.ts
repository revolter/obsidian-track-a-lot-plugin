import { Setting } from 'obsidian';
import { RecipeExtraSettingsAdder } from 'src/settings/RecipeExtraSettingsAdder';
import { SettingsAdder } from 'src/settings/SettingsAdder';
import { HanayamaHuzzlesRecipe } from '../HanayamaHuzzlesRecipe';
import { HanayamaHuzzlesRecipeSettings } from './HanayamaHuzzlesRecipeSettings';

export class HanayamaHuzzlesRecipeExtraSettingsAdder implements RecipeExtraSettingsAdder {
	private includeChessPuzzlesSetting: Setting;

	constructor(
		private root: HTMLElement,
		private settingsAdder: SettingsAdder,
		private settings: HanayamaHuzzlesRecipeSettings
	) {}

	add(): Setting[] {
		this.includeChessPuzzlesSetting = this.settingsAdder.add(
			'Include chess puzzles',
			this.root.createFragment(
				this.root.createText('span', 'Whether to include the chess puzzles ('),
				this.root.createLink(HanayamaHuzzlesRecipe.CHESS_PUZZLES_DATA_SOURCE.url),
				this.root.createText('span', ') or not.')
			)
		);

		return [this.includeChessPuzzlesSetting];
	}

	activate(onChange: () => Promise<void>) {
		this.includeChessPuzzlesSetting.addToggle(toggle => {
			return toggle
				.setValue(this.settings.includeChessPuzzles)
				.onChange(async (value) => {
					this.settings.includeChessPuzzles = value;

					await onChange();
				});
		});
	}
}
