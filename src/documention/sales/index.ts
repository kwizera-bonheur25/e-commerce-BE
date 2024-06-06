import { responses } from "../responses";

const get_sales = {
	sales: {
		tags: ["Sales"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "get all your Sales",
		consumes: ["application/json"],
		responses,
	},
};

const get_single_sale = {
	get_sale: {
		tags: ["Sales"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "get a single sale",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
				schema: {
					type: "string",
					example: "9e555bd6-0f36-454a-a3d5-89edef4ff9d4",
				},
			},
		],
		consumes: ["application/json"],
		responses,
	},
};

const update_sale_status = {
	update_status: {
		tags: ["Sales"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Update a sale status",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
				schema: {
					type: "string",
					example: "9e555bd6-0f36-454a-a3d5-89edef4ff9d4",
				},
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							status: {
								type: "string",
								description: "Sale status",
								required: true,
								example: "canceled",
							},
							deliveryDate: {
								type: "string",
								description: "Sale delivery date",
								required: true,
								example: "2022-10-10",
							},
						},
					},
				},
			},
		},
		consumes: ["application/json"],
		responses,
	},
};

export const sales = {
	"/api/v1/sales": {
		get: get_sales["sales"],
	},
	"/api/v1/sales/{id}": {
		get: get_single_sale["get_sale"],
	},
	"/api/v1/sales/{id}/status": {
		patch: update_sale_status["update_status"],
	},
};
