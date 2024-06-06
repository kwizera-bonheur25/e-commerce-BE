import { mock_users } from "../../mock/static";
import { findAllUsers } from "../../services/user.services";
import { UserModelAttributes } from "../../types/model";
import { read_function } from "../../utils/db_methods";

jest.mock("../../utils/db_methods", () => ({
	read_function: jest.fn(),
}));

const users: UserModelAttributes[] = mock_users;

describe("FUNCTIONS", () => {
	beforeAll(async () => {
		(
			read_function as jest.MockedFunction<typeof read_function>
		).mockResolvedValue(users);
	});
	it("should find all users and return an array of user objects", async () => {
		const users = await findAllUsers();

		expect(Array.isArray(users)).toBe(true);

		users.forEach((user) => {
			expect(typeof user).toBe("object");
		});
	});
});
