import { Trackable } from './Trackable';

export class TrackablesUpdater {
	updatedTrackables<T extends Trackable>(currentTrackables: T[], newTrackables: T[]): T[] {
		const indexedCurrentTrackables = currentTrackables.slice(1).reduce((map, trackable) => {
			map[trackable.identifier] = trackable;

			return map;
		}, {} as {[key: string]: T});

		newTrackables.forEach( trackable => {
			const indexedCurrentTrackable = indexedCurrentTrackables[trackable.identifier];

			if (indexedCurrentTrackable != null) {
				trackable.status = indexedCurrentTrackable.status;

				delete indexedCurrentTrackables[trackable.identifier];
			}
		});

		const withdrawnTrackables = Object.keys(indexedCurrentTrackables).map(key => indexedCurrentTrackables[key]);
		const withdrawnModifiedTrackables = withdrawnTrackables.filter(trackable => trackable.status !== '');

		return [...newTrackables, ...withdrawnModifiedTrackables];
	}
}
