declare global {
	interface HTMLElement {
		createText<K extends keyof HTMLElementTagNameMap>(type: K, text: string): HTMLElementTagNameMap[K];
		createLink(url: string, info?: DomElementInfo): HTMLAnchorElement;
		createFragment(...elements: HTMLElement[]): DocumentFragment;
	}
}

HTMLElement.prototype.createText = function <K extends keyof HTMLElementTagNameMap>(type: K, text: string): HTMLElementTagNameMap[K] {
	return this.createEl(type, { text: text });
};

HTMLElement.prototype.createLink = function(url: string, info?: DomElementInfo): HTMLAnchorElement {
	return this.createEl('a', Object.assign({ href: url, text: url }, info || {}));
};

HTMLElement.prototype.createFragment = function(...elements: HTMLElement[]): DocumentFragment {
	const fragment = new DocumentFragment();
	fragment.append(...elements);

	return fragment;
};

export { };
