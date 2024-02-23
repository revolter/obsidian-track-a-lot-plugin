import { Root, Table } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';

export class MarkdownTableConverter {
	tableFromString(string: string): Table | null {
		const root = remark()
			.use(remarkGFM)
			.parse(string);

		return root.children.find(node => node.type === 'table') as Table | null;
	}

	arrayOfArraysFromTable(table: Table): string[][] {
		return table.children.map(row =>
			row.children.map(cell =>
				cell.children.map(child => {
					switch (child.type) {
						case 'image': return `![${child.alt}](${child.url})`;
						default: return toString(child);
					}
				}).join('')
			)
		);
	}

	tableToString(table: Table): string {
		const root: Root = {
			type: 'root',
			children: [table]
		};

		return remark()
			.use(remarkGFM)
			.stringify(root)
			.replace(/\n$/, '');
	}
}
