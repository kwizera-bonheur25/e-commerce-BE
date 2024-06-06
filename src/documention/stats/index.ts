import { responses } from "../responses";

const read_statistics = {
	tags: ["stats"],
	security: [
		{
			bearerAuth: [],
		},
	],

	sammary: "Here is your staticts",
	description: "Seller statistics",
	responses,
};

export const stats = {
	"/api/v1/stats": {
		get: read_statistics,
	},
};
