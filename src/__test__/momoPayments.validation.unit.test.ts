import { momoPayInValidNumber, momoPayAllowedNumber } from "../mock/static";
import { momoValidation } from "../validations/momo.payments.validate";

describe("MoMo phone number validation", () => {
	it("should validate allowed numbers correctly", () => {
		momoPayAllowedNumber.forEach((number) => {
			const { error } = momoValidation.validate(number);
			expect(error).toBeUndefined();
		});
	});

	it("should validate numbers starting with 078 or 079 correctly", () => {
		const validNumbers = ["0781234567", "0799876543"];

		validNumbers.forEach((number) => {
			const { error } = momoValidation.validate(number);
			expect(error).toBeUndefined();
		});
	});

	it("should invalidate numbers with incorrect formats", () => {
		momoPayInValidNumber.forEach((number) => {
			const { error } = momoValidation.validate(number);
			expect(error).toBeDefined();
			if (number.startsWith("078") || number.startsWith("079")) {
				expect(error?.details[0].message).toBe(
					"Phone must start with 078 or 079 and be 10 digits long",
				);
			} else {
				expect(error?.details[0].message).toBe(
					`Phone must start with 078 or 079 and be 10 digits long`,
				);
			}
		});
	});
});
