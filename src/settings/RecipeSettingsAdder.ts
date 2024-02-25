import { Setting } from 'obsidian';
import { SettingsAdder } from './SettingsAdder';

export class RecipeSettingsAdder {
	private activeSetting: Setting;

	constructor(private root: HTMLElement, private settingsAdder: SettingsAdder) {}

	add(name: string, webpage: string) {
		this.#addHeader(name, webpage);
		this.activeSetting = this.#addActiveSetting();
	}

	activate(getter: () => boolean, setter: (value: boolean) => Promise<void>) {
		this.activeSetting.addToggle(toggle => {
			return toggle
				.setValue(getter())
				.onChange(async (value) => {
					setter(value);
				});
		});
	}

	#addHeader(name: string, webpage: string) {
		this.root.createText('h3', name, { cls: 'no-bottom-margin' });
		this.root.createLink(webpage, { cls: ['setting-item-description', 'default-bottom-margin'] });
	}

	#addActiveSetting(): Setting {
		return this.settingsAdder.add(
			'Active',
			this.root.createFragment(
				this.root.createText('span', 'Whether this list shows up in the '),
				this.root.createText('code', 'Command palette'),
				this.root.createText('span', ' or not.')
			)
		);
	}
}
