import { Trackable } from 'src/tracking/Trackable';

export interface NameAndImage extends Trackable {
	readonly name: string;
	readonly imageLink: string;
}
