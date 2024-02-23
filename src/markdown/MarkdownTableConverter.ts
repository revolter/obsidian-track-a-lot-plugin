import { Root, Table } from 'mdast';
import { remark } from 'remark';
import remarkGFM from 'remark-gfm';

export class MarkdownTableConverter {
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
