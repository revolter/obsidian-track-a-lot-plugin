export interface Trackable {
	readonly identifier: string;
	readonly status: string;

	withStatus(newStatus: string): Trackable;
}
