import { responses } from "../responses";

const search = {
	Search_product: {
		tags: ["SEARCH"],
		summary: "Search product by name , price or category",
		parameters: [
			{
				name: "name",
				in: "query",
				description: "Name of the item to search",
			},
			{
				name: "minPrice",
				in: "query",
				description: "price of the item to search",
			},
			{
				name: "maxPrice",
				in: "query",
				description: "price of the item to search",
			},
			{
				name: "categoryName",
				in: "query",
				description: "category of the item to search",
			},
		],
		responses,
	},
};

export const searches = {
	"/api/v1/products/search": {
		get: search["Search_product"],
	},
};
