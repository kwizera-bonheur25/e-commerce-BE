import { mock_users } from "../../mock/static";
import { sendEmailNotification } from "../../services/password.notification";
import { findAllUsers } from "../../services/user.services";
import { UserModelAttributes } from "../../types/model";
import {
	checkPasswordExpiration,
	passwordExpirationDuration,
} from "../../utils/passwordExpiration";

jest.mock("../../services/password.notification", () => ({
	sendEmailNotification: jest.fn(),
}));

jest.mock("../../services/user.services", () => ({
	findAllUsers: jest.fn(),
}));

describe("passwordExpirationDuration", () => {
	it("should correctly calculate duration in milliseconds for months", () => {
		expect(passwordExpirationDuration("2 months")).toEqual(
			2 * 30 * 24 * 60 * 60 * 1000,
		);
	});

	it("should correctly calculate duration in milliseconds for days", () => {
		expect(passwordExpirationDuration("5 days")).toEqual(
			5 * 24 * 60 * 60 * 1000,
		);
	});

	it("should throw an error for invalid duration", () => {
		expect(() => passwordExpirationDuration("10 years")).toThrow(
			"Duration time should be in months or days!",
		);
	});
});

const users: UserModelAttributes[] = mock_users;
describe("checkPasswordExpiration", () => {
	beforeEach(() => {
		(
			findAllUsers as jest.MockedFunction<typeof findAllUsers>
		).mockResolvedValue(users);
	});

	it("should update password expiration and send email notification for expired passwords", async () => {
		await checkPasswordExpiration();
		expect(sendEmailNotification).toHaveBeenCalledTimes(1);
		expect(sendEmailNotification).toHaveBeenCalledWith(
			expect.objectContaining({ ...users[1] }),
		);
	});

	it("should not update password expiration and send email notification for non-expired passwords", async () => {
		await checkPasswordExpiration();
		expect(sendEmailNotification).not.toHaveBeenCalledWith(
			expect.objectContaining({ ...users[0] }),
		);
	});
});
