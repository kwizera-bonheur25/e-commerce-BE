import axios from "axios";
import base64 from "base-64";
import {
	MTN_MOMO_API_KEY,
	MTN_MOMO_GET_TOKEN_URL,
	MTN_MOMO_USERNAME,
	MTN_MOMO_SUBSCRIPTION_KEY,
} from "./keys";

export const getToken = async () => {
	try {
		const username = MTN_MOMO_USERNAME;
		const password = MTN_MOMO_API_KEY;
		const credentials = base64.encode(`${username}:${password}`);
		const subscriptionKey = MTN_MOMO_SUBSCRIPTION_KEY;

		const response = await axios.post(
			`${MTN_MOMO_GET_TOKEN_URL}`,
			{},
			{
				headers: {
					Authorization: `Basic ${credentials}`,
					"Ocp-Apim-Subscription-key": subscriptionKey,
				},
			},
		);

		const token = response.data.access_token;
		return token;
	} catch (error: any) {
		console.log("error: ", error?.message);
	}
};
