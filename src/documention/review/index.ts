import { responses } from "../responses";

const review_routes = {
	read_all: {
		tags: ["Review"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Get Review",
		consumes: ["application/json"],
		responses,
	},
	Get_All_Reviews: {
		tags: ["Review"],
		summary: "Get All Reviews",
		responses,
	},
	create_review: {
		tags: ["Review"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Create Review",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							productId: {
								type: "string",
								example: "21b8b5ae-df57-4b81-8128-3a3041658e90",
							},
							feedBack: {
								type: "string",
								example: "my feedBack",
							},
							ratings: {
								type: "number",
								example: "2.4",
							},
						},
					},
				},
			},
		},
		responses,
	},
	Get_Review_On_Product: {
		tags: ["Review"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Get all review of product",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
			},
		],
		responses,
	},
	Edit_review: {
		tags: ["Review"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Edit Review",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							feedBack: {
								type: "string",
								example: "update feeback",
							},
							ratings: {
								type: "number",
								example: "3.7",
							},
						},
					},
				},
			},
		},
		responses,
	},
	Delete_review: {
		tags: ["Review"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "delete Review",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
			},
		],
		responses,
	},
};

export const review = {
	"/api/v1/reviews/": {
		get: review_routes["Get_All_Reviews"],
		post: review_routes["create_review"],
	},
	"/api/v1/products/{id}/reviews": {
		get: review_routes["Get_Review_On_Product"],
	},
	"/api/v1/reviews/{id}": {
		patch: review_routes["Edit_review"],
		delete: review_routes["Delete_review"],
	},
};
