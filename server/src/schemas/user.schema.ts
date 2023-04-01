import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
	body: object({
		firstName: string({
			required_error: 'First name is required.',
		}),
		lastName: string({
			required_error: 'Last name is required.',
		}),
		email: string({
			required_error: 'Email is required.',
		}).email('You must enter a valid email address.'),
		password: string({
			required_error: 'Password is required.',
		}).min(8, 'Password must be a minimum of 8 characters.'),
		confirmPassword: string({
			required_error: 'Confirm password is required.',
		}),
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Password do not match.',
		path: ['confirmPassword'],
	}),
});

export const verifyUserSchema = object({
	params: object({
		id: string({
			required_error: 'ID is required.',
		}),
		verificationCode: string({
			required_error: 'Verification code is required.',
		}),
	}),
});

export const forgottenPasswordSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required.',
		}).email('Not a valid email.'),
	}),
});

export const resetPasswordSchema = object({
	params: object({
		id: string({
			required_error: 'ID is required.',
		}),
		passwordResetCode: string({
			required_error: 'Password reset code is required.',
		}),
	}),
	body: object({
		password: string({
			required_error: 'Password is required.',
		}).min(8, 'Password must be a minimum of 8 characters.'),
		confirmPassword: string({
			required_error: 'Confirm password is required.',
		}),
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Password do not match.',
		path: ['confirmPassword'],
	}),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
export type ForgottenPasswordInput = TypeOf<
	typeof forgottenPasswordSchema
>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
