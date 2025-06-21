import { Trackable } from 'src/tracking/Trackable';
import { NameAndImage } from '../name_and_image/NameAndImage';

export class EisKaltIceCream implements NameAndImage {
	readonly identifier: string;

	constructor(
		public readonly name: string,
		public readonly imageLink: string,
		public readonly status = ''
	) {
		this.identifier = name;
	}

	withStatus(newStatus: string): Trackable {
		return new EisKaltIceCream(this.name, this.imageLink, newStatus);
	}
}
