import { Setting } from 'obsidian';

export class SettingsAdder {
	constructor(private root: HTMLElement) {}

	add(name: string, description: (string | DocumentFragment) | null = null): Setting {
		const setting = new Setting(this.root).setName(name);

		if (description != null) {
			setting.setDesc(description);
		}

		return setting;
	}
}
