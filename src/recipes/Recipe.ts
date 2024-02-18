export interface Recipe {
	updatedListInContent(content: string): Promise<string>;
}
