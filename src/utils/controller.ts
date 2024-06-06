import { Request, Response } from "express";
import { validate as isValidUUID } from "uuid";
import { sendResponse } from "./http.exception";

export const category_utils = (req: Request, res: Response) => {
	return {
		getId: req.params.id,
		isValidUUID: (categoryId: string) => {
			const is_valid_uuid = isValidUUID(categoryId);
			if (!is_valid_uuid) {
				sendResponse(res, 400, "BAD REQUEST", "You provided Invalid ID!");
				return false;
			} else {
				return true;
			}
		},
	};
};

export const getProductID = (req: Request, res: Response): string | null => {
	const productId = req.params.id;
	if (!isValidUUID(productId)) {
		sendResponse(res, 400, "BAD REQUEST", "You provided an invalid ID!");
		return null;
	}
	return productId;
};
