import { Trackable } from 'src/tracking/Trackable';

export class IQPuzzle implements Trackable {
	readonly identifier: string;

	constructor(
		public readonly name: string,
		public readonly imageLink: string,
		public readonly status = ''
	) {
		this.identifier = name;
	}

	withStatus(newStatus: string): Trackable {
		return new IQPuzzle(this.name, this.imageLink, newStatus);
	}
}
