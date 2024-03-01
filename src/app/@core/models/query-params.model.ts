
const cantidadItemsPaginacion = 10;

export class QueryParamsModel {
	// fields
	searchText: any;
	descendingOrder: boolean;
	orderBy: string;
	page: number;
	pageSize: number;

	// constructor overrides
	constructor(
		_searchText: string = '',
		_page: number = 0,
		_pageSize: number = cantidadItemsPaginacion,
		_descendingOrder: boolean = true,
		_orderBy: string = ''
	) {
		this.searchText = _searchText;
		this.descendingOrder = _descendingOrder;
		this.orderBy = _orderBy;
		this.page = _page;
		this.pageSize = _pageSize;
	}
}
