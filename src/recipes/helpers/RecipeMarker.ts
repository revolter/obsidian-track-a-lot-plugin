import escapeStringRegexp from 'escape-string-regexp';

export class RecipeMarker {
	constructor(private name: string) {}

	get start(): string { return `<!-- ${this.name} start -->`; }
	get end(): string { return `<!-- ${this.name} end -->`; }

	get regexEscapedStart(): string { return escapeStringRegexp(this.start); }
	get regexEscapedEnd(): string { return escapeStringRegexp(this.end); }
}
