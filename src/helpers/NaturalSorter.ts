export function naturalCompare(first: string, second: string): number {
	return first.localeCompare(second, undefined, {
		numeric: true,
		sensitivity: 'base'
	});
}
