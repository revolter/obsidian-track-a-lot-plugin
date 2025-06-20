import { Delete, Image, PhrasingContent, Table, TableCell, TableRow, Text } from 'mdast';

export class MarkdownTableFactory {
	table(header: TableRow, rows: TableRow[]): Table {
		const allRows = [
			header,
			...rows
		];

		return {
			type: 'table',
			children: allRows as never // https://stackoverflow.com/a/47219058/865175
		};
	}

	tableRowNode(cells: TableCell[]): TableRow {
		return {
			type: 'tableRow',
			children: cells
		};
	}

	textTableCellNode(text: string): TableCell {
		return this.tableCellNode([this.textNode(text)]);
	}

	deletedTextTableCellNode(text: string): TableCell {
		return this.tableCellNode([this.deletedTextNode(text)]);
	}

	imageTableCellNode(url: string, size: number): TableCell {
		return this.tableCellNode([this.imageNode(url, size)]);
	}

	tableCellNode(contents: PhrasingContent[]): TableCell {
		return {
			type: 'tableCell',
			children: contents
		};
	}

	textNode(text: string): Text {
		return {
			type: 'text',
			value: text
		};
	}

	deletedTextNode(text: string): Delete {
		return {
			type: 'delete',
			children: [this.textNode(text)]
		};
	}

	imageNode(url: string, size: number): Image {
		return {
			type: 'image',
			alt: `|${size}`,
			url: url
		};
	}

	interleave<Array extends PhrasingContent, Separator extends PhrasingContent>(array: Array[], separator: Separator) {
		return array.flatMap(element => [separator, element]).slice(1);
	}
}
