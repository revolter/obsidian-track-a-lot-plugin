export class RecipeMarker {
	constructor(private name: string) {}

	get start(): string { return `<!-- ${this.name} start -->`; }
	get end(): string { return `<!-- ${this.name} end -->`; }
}
