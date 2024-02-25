import { Trackable } from 'src/tracking/Trackable';

export class HanayamaHuzzle implements Trackable {
	identifier: string;

	constructor(
		public readonly level: string,
		public readonly index: string,
		public readonly name: string,
		public readonly imageLinks: readonly string[],
		public readonly status = ''
	) {
		this.identifier = name;
	}

	withStatus(newStatus: string): Trackable {
		return new HanayamaHuzzle(this.level, this.index, this.name, this.imageLinks, newStatus);
	}
}
