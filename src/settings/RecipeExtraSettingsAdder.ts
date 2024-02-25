import { Setting } from 'obsidian';

export interface RecipeExtraSettingsAdder {
	add(): Setting[];
	activate(onChange: () => Promise<void>): void;
}
