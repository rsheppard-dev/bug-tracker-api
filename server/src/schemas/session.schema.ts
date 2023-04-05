import { object, string, TypeOf } from 'zod';

export const createSessionSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required.',
		}).email('Invalid email or password.'),
		password: string({
			required_error: 'Password is required.',
		}).min(8, 'Invalid email or password.'),
	}),
});

export const refreshTokenSchema = object({
	body: object({
		refreshToken: string({
			required_error: 'Refresh token is required.',
		}),
	}),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];
export type RefreshTokenInput = TypeOf<typeof refreshTokenSchema>['body'];
