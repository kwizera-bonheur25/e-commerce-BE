import Joi from "joi";
const createRoleValidation = Joi.object({
	roleName: Joi.string().required().messages({
		"string.empty": "roleName field can't be empty!",
	}),
}).options({ allowUnknown: false });

const ValidateRoleID = Joi.object({
	role: Joi.string().required().messages({
		"string.empty": "role field can't be empty!",
		// "string.guid": "roleId must be a valid UUIDv4 string!",
	}),
}).options({ allowUnknown: false });

const validateRoleID = (body: any) => {
	const { error } = ValidateRoleID.validate(body);
	return error;
};

const validateNewRole = (body: any) => {
	const { error } = createRoleValidation.validate(body);
	return error;
};
export { validateNewRole, validateRoleID };
