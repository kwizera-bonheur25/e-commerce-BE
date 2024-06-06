import Joi from "joi";

const update_profile_validation = Joi.object({
	firstName: Joi.string().messages({
		"string.empty": "First name cannot be empty",
	}),
	lastName: Joi.string().messages({
		"string.empty": "Last name cannot be empty",
	}),
	gender: Joi.string().valid("Male", "Female").messages({
		"any.only": "Gender must be one of 'Male' or 'Female''",
		"string.empty": "Gender cannot be empty",
	}),
	phoneNumber: Joi.string()
		.pattern(/^\+\d{11,}$/)
		.messages({
			"string.pattern.base":
				'"phone number" must be a valid and has country code',
			"string.empty": "Phone number cannot be empty",
		}),
	birthDate: Joi.date().iso(),
	preferredLanguage: Joi.string().min(4).messages({
		"string.empty": "Preferred language cannot be empty",
	}),
	preferredCurrency: Joi.string().min(3).messages({
		"string.empty": "Preferred Currency cannot be empty",
	}),
	profileImage: Joi.string().messages({
		"string.empty": "Profile Image cannot be empty",
	}),
	addressLine1: Joi.string().messages({
		"string.empty": "Address line 1 cannot be empty",
	}),
	addressLine2: Joi.string().messages({
		"string.empty": "Address line 2 cannot be empty",
	}),
	country: Joi.string().messages({
		"string.empty": "Country cannot be empty",
	}),
	city: Joi.string().messages({
		"string.empty": "City cannot be empty",
	}),
	zipCode: Joi.string()
		.pattern(/^\d{4,}$/)
		.messages({
			"string.pattern.base": "Zip code must be at least 4 digits long",
		}),
}).options({ allowUnknown: false });

export const userProfileValidation = (profile: any) => {
	const { error } = update_profile_validation.validate(profile);
	return error;
};
