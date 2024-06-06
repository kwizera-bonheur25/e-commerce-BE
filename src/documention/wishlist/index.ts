import { responses } from "../responses";

const create_wish = {
	tags: ["Wishes"],
	summary: "Add a new item to your wishlist or remove an existing one.",
	security: [
		{
			bearerAuth: [],
		},
	],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					format: "uuid",
					properties: {
						productId: {
							type: "string",
							description: "product id",
							required: true,
							example: "9e545bd7-0f36-454a-a3d5-89edef4ff9d7",
						},
					},
				},
			},
		},
	},
	responses,
};

const read_wishes = {
	all: {
		tags: ["Wishes"],
		summary: "Getting all wishes",
		security: [
			{
				bearerAuth: [],
			},
		],
		responses,
	},
	single: {
		tags: ["Wishes"],
		summary: "Getting single wishes",
		security: [
			{
				bearerAuth: [],
			},
		],
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
				schema: {
					type: "string",
					format: "uuid",
				},
			},
		],
		responses,
	},
};

export const wishes = {
	"/api/v1/wishes": {
		post: create_wish,
	},

	"/api/v1/wishes/": {
		get: read_wishes["all"],
	},

	"/api/v1/wishes/{id}": {
		get: read_wishes["single"],
	},
};
