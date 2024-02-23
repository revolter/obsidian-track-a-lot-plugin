import { Trackable } from './Trackable';

export class TrackablesUpdater {
	updatedTrackables<T extends Trackable>(currentTrackables: T[], newTrackables: T[]): T[] {
		const indexedCurrentTrackables = currentTrackables.slice(1).reduce((map, trackable) => {
			map[trackable.identifier] = trackable;

			return map;
		}, {} as {[key: string]: T});
		const syncedTrackables = newTrackables.map( trackable => {
			const indexedCurrentTrackable = indexedCurrentTrackables[trackable.identifier];

			if (indexedCurrentTrackable != null) {
				delete indexedCurrentTrackables[trackable.identifier];

				return trackable.withStatus(indexedCurrentTrackable.status) as T;
			} else {
				return trackable;
			}
		});

		const withdrawnTrackables = Object.keys(indexedCurrentTrackables).map(key => indexedCurrentTrackables[key]);
		const withdrawnModifiedTrackables = withdrawnTrackables.filter(trackable => trackable.status !== '');

		return [...syncedTrackables, ...withdrawnModifiedTrackables];
	}
}
