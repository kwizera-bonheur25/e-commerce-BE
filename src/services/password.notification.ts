import { sendEmail } from "../helpers/nodemailer";
import { UserModelAttributes } from "../types/model";
import { update_pass_email_template } from "../utils/html.utils";

export const sendEmailNotification = async (user: UserModelAttributes) => {
	const options = {
		to: user.email,
		subject: "Password update required <Hacker's E-commerce>",
		html: update_pass_email_template(user),
	};
	await sendEmail(options);
	console.log("Password update email sent!");
};
