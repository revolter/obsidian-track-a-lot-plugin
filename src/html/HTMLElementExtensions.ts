declare global {
	interface HTMLElement {
		createFragment(...elements: HTMLElement[]): DocumentFragment;
	}
}

HTMLElement.prototype.createFragment = function(...elements: HTMLElement[]): DocumentFragment {
	const fragment = new DocumentFragment();
	fragment.append(...elements);

	return fragment;
};

export { };
