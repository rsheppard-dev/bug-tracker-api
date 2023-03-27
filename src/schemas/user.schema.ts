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

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
