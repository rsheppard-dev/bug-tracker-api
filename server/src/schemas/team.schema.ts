import { object, string, union, any, TypeOf } from 'zod';

export const createTeamSchema = object({
	body: object({
		name: string()
			.nonempty({ message: 'Team name is required.' })
			.min(2, 'Team name must be at least 2 characters long.')
			.max(30, 'Team name  cannot be longer than 30 characters.'),
		description: union([
			string().min(2, 'Decription must consist of at least 10 characters.'),
			string().length(0),
		]).optional(),
		logo: any().optional(),
		owner: string().nonempty({ message: 'Owner is required.' }),
	}),
});

export const updateTeamSchema = object({
	body: object({
		id: string({
			required_error: 'ID is required.',
		}),
		name: union([
			string()
				.min(2, 'Team name must be at least 2 characters long.')
				.max(30, 'Team name  cannot be longer than 30 characters.'),
			string().length(0),
		]).optional(),
		description: union([
			string().min(2, 'Description must consist of at least 10 characters.'),
			string().length(0),
		]).optional(),
		logo: any().optional(),
		owner: string().optional(),
	}),
});

export const deleteTeamSchema = object({
	body: object({
		id: string({
			required_error: 'Team ID is required.',
		}),
	}),
});

// get typescript type from schema
export type CreateTeamInput = TypeOf<typeof createTeamSchema>['body'];
export type UpdateTeamInput = TypeOf<typeof updateTeamSchema>['body'];
export type DeleteTeamInput = TypeOf<typeof deleteTeamSchema>['body'];
