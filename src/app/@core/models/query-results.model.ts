export class QueryResultsModel<T> {
	items: any[];
	totalCount: number;
	errorMessage: string;

	constructor(_items: T[] = [], _errorMessage: string = '') {
		this.items = _items;
		this.totalCount = _items.length;
	}
}

