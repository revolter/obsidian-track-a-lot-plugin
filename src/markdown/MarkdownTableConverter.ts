import { Root, Table } from 'mdast';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';

export class MarkdownTableConverter {
	tableFromString(string: string): Table | null {
		const root = remark()
			.use(remarkGFM)
			.parse(string);

		return root.children.find(node => node.type === 'table') as Table | null;
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
