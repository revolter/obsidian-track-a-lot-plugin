import { Trackable } from 'src/tracking/Trackable';

export class HanayamaHuzzle implements Trackable {
	identifier: string;

	constructor(
		public readonly level: string,
		public readonly index: string,
		public readonly name: string,
		public readonly imageLinks: string[],
		public status = ''
	) {
		this.identifier = name;
	}
}
