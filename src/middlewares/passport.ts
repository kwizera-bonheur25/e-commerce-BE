import { Request } from "express";
import passport from "passport";
import GooglePassport, { VerifyCallback } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { v4 as uuidv4 } from "uuid";
import database_models from "../database/config/db.config";
import { getRoleByName } from "../services/user.services";
import { UserModelAttributes } from "../types/model";
import {
	GOOGLE_CALLBACK_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET_ID,
} from "../utils/keys";
import { hashPassword } from "../utils/password";
import { isValidPassword } from "../utils/password.checks";

interface GoogleProfileData {
	id: string;
	name: {
		givenName: string;
		familyName: string;
	};
	emails: Array<{ value: string }>;
}

const GoogleStrategy = GooglePassport.Strategy;

passport.serializeUser(function (user: any, done) {
	done(null, user);
});

passport.deserializeUser(function (user: any, done) {
	done(null, user);
});

passport.use(
	"signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const role = await getRoleByName("BUYER");
				if (!role) {
					return done(null, false, { message: "you are assigned to no role" });
				}
				const data = {
					email: email.trim(),
					password: await hashPassword(password),
					confirmPassword: await hashPassword(req.body.confirmPassword),
					userName:
						req.body.userName == null
							? req.body.email.split("@")[0]
							: req.body.userName,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					role: role?.dataValues.id as string,
					isActive: true,
					isVerified: false,
					gender: req.body.gender || " ",
					birthDate: req.body.birthDate || "01.01.1900",
					phoneNumber: req.body.phoneNumber || "+250",
					preferredLanguage: req.body.preferredLanguage || " ",
					preferredCurrency: req.body.preferredCurrency || " ",
					profileImage:
						req.body.profileImage ||
						"https://res.cloudinary.com/dq6npfdgz/image/upload/v1715034196/cqpjfmkwrk6sbwyh4ysj.png",
					addressLine1: req.body.addressLine1 || " ",
					addressLine2: req.body.addressLine2 || " ",
					country: req.body.country || " ",
					city: req.body.city || " ",
					zipCode: req.body.zipCode || 0,
				};
				const userExist = await database_models.User.findOne({
					where: {
						email: data.email,
					},
				});
				if (userExist) {
					return done(null, false, { message: "User already exist!" });
				}
				const user = await database_models.User.create({ ...data });
				done(null, user);
			} catch (error) {
				console.log(error);

				done(error);
			}
		},
	),
);

passport.use(
	"login",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (_req: Request, email, password, done) => {
			try {
				const user = await database_models.User.findOne({
					where: { email },
					include: [
						{
							model: database_models.role,
							as: "Roles",
						},
					],
				});

				const my_user = user?.toJSON();

				if (!user) return done(null, false, { message: "Wrong credentials!" });

				const currPassword = my_user?.password as string;

				const isValidPass = await isValidPassword(password, currPassword);

				if (!isValidPass) {
					return done(null, false, { message: "Wrong credentials!" });
				}

				if (!user.dataValues.isVerified) {
					return done(null, false, { message: "Verify your Account" });
				}
				return done(null, my_user);
			} catch (error) {
				done(error);
			}
		},
	),
);
interface GoogleProfileData {
	id: string;
	name: {
		givenName: string;
		familyName: string;
	};
	emails: Array<{ value: string }>;
}

passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_SECRET_ID,
			callbackURL: GOOGLE_CALLBACK_URL,
			scope: ["profile", "email"],
			passReqToCallback: true,
		},
		(
			_req: Request,
			_accessToken: string,
			_refreshToken: string,
			profile: any,
			cb: VerifyCallback,
		) => {
			cb(null, userProfile(profile));
		},
	),
);

const userProfile = async (
	profile: GoogleProfileData,
): Promise<UserModelAttributes> => {
	const { name, emails } = profile;

	const role = await getRoleByName("BUYER");

	if (!role) {
		throw new Error("Role not found");
	}
	const user = {
		id: uuidv4(),
		userName: emails[0].value.split("@")[0],
		firstName: name.givenName,
		lastName: name.familyName,
		email: emails[0].value,
		role: role?.dataValues.id as string,
		password: "",
		confirmPassword: "",
		isVerified: true,
		gender: "",
		birthDate: new Date(),
		phoneNumber: "+250",
		preferredLanguage: "",
		preferredCurrency: "",
		profileImage: "",
		addressLine1: "",
		addressLine2: "",
		country: "",
		city: "",
		zipCode: 0,
		isActive: true,
	};

	return user;
};

passport.use(
	"google",
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_SECRET_ID,
			callbackURL: GOOGLE_CALLBACK_URL,
			scope: ["profile", "email"],
			passReqToCallback: true,
		},
		async (
			_req: Request,
			_accessToken: string,
			_refreshToken: string,
			profile: any,
			cb: VerifyCallback,
		) => {
			try {
				const user = await userProfile(profile);
				cb(null, user);
			} catch (error) {
				cb(error as Error);
			}
		},
	),
);

export default passport;
