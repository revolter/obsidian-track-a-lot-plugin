import { Image, PhrasingContent, TableCell, TableRow, Text } from 'mdast';

export class MarkdownTableFactory {
	tableRowNode(children: TableCell[]): TableRow {
		return {
			type: 'tableRow',
			children: children
		};
	}

	textTableCellNode(text: string): TableCell {
		return this.tableCellNode([this.textNode(text)]);
	}

	tableCellNode(children: PhrasingContent[]): TableCell {
		return {
			type: 'tableCell',
			children: children
		};
	}

	textNode(text: string): Text {
		return {
			type: 'text',
			value: text
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
