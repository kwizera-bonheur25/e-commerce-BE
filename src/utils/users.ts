import { ExpandedRequest } from "../middlewares/auth";
class UserUtils {
	static getRequestUserId(req: ExpandedRequest) {
		return (req as ExpandedRequest).user?.id || "";
	}
}

export default UserUtils;
