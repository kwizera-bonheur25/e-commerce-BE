import { sendEmailNotification } from "../services/password.notification";
import { findAllUsers } from "../services/user.services";
import { UserModelAttributes } from "../types/model";
import { insert_function } from "./db_methods";
import { PASS_EXPIRE_DURATION } from "./keys";

export const checkPasswordExpiration = async () => {
	const users: UserModelAttributes[] = await findAllUsers();
	for (const user of users) {
		try {
			const durationSinceUpdate =
				Date.now() - (user.lastTimePasswordUpdated as Date)?.getTime();
			const password_expiration_duration =
				passwordExpirationDuration(PASS_EXPIRE_DURATION);
			const condition = { where: { id: user.id } };

			if (
				durationSinceUpdate > password_expiration_duration &&
				user.isVerified &&
				user.isActive
			) {
				const isPasswordExpired = true;

				if (!user.isPasswordExpired) {
					await insert_function<UserModelAttributes>(
						"User",
						"update",
						{ isPasswordExpired },
						condition,
					);
					await sendEmailNotification(user);
				}
			}
		} catch (error) {
			console.log(error);
			return;
		}
	}
};

export const passwordExpirationDuration = (duration: string) => {
	const [period, unit] = duration.split(" ");
	const duration_period = parseInt(period);

	switch (unit) {
		case "months":
			return duration_period * 30 * 24 * 60 * 60 * 1000;
		case "days":
			return duration_period * 24 * 60 * 60 * 1000;
		default:
			throw new Error("Duration time should be in months or days!");
	}
};
