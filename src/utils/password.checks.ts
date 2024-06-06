import bcrypt from "bcrypt";

// password check when logging in a user
export const isValidPassword = async (
	password: string,
	currPass: string,
): Promise<boolean> => {
	const isValid = await bcrypt.compareSync(password, currPass);

	return isValid;
};
