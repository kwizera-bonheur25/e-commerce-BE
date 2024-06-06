import { Request } from "express";
import { PaymentsModelAttributes, cartModelAttributes } from "./model";

export type PaymentDetails = {
	payerId: string;
	paymentMethod: string;
	paymentId: string;
	phoneNumber?: string;
	status?: string;
};

export interface CartRequest extends Request {
	cart: cartModelAttributes;
}

export interface MomoInfo extends Request {
	momoInfo?: {
		XReferenceId: string;
	};
}

export interface TransactionRequest extends Request {
	transaction?: PaymentsModelAttributes;
	transactionData?: transactionDataTypes;
}

export type transactionDataTypes = {
	token?: string;
	XReferenceId?: string;
	subscriptionKey?: string;
	targetEnvironment?: string;
};
