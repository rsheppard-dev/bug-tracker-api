import { useState, useId } from 'react';

import { object, string, union, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import type { ReduxError } from '../../../types/reduxError';
import type { User } from '../../../types/user';

const updateUserSchema = object({
	id: string(),
	firstName: union([
		string()
			.min(2, 'First name must be at least 2 characters long.')
			.max(30, 'First name  cannot be longer than 30 characters.'),
		string().length(0),
	]).optional(),
	lastName: union([
		string()
			.min(2, 'First name must be at least 2 characters long.')
			.max(30, 'First name  cannot be longer than 30 characters.'),
		string().length(0),
	]).optional(),
	email: union([
		string().email('You must enter a valid email address.'),
		string().length(0),
	]).optional(),
	password: union([
		string().min(8, 'Password must be a minimum of 8 characters.'),
		string().length(0),
	]).optional(),
	confirmPassword: string().optional(),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords do not match.',
	path: ['confirmPassword'],
});

// get typescript type from schema
type UpdateUserInput = TypeOf<typeof updateUserSchema>;

function EditUserForm({ user }: { user: User }) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const id = useId();
	const navigate = useNavigate();

	const [updateUser] = useUpdateUserMutation();
	const [deleteUser, { isLoading }] = useDeleteUserMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UpdateUserInput>({
		resolver: zodResolver(updateUserSchema),
	});

	async function onSubmit(values: UpdateUserInput) {
		try {
			setErrorMessage(null);

			const result = await updateUser(values);

			// check for errors
			if ('error' in result) {
				const error = result.error as ReduxError;
				setErrorMessage(error.data.message);
			} else {
				navigate('/dash/users');
			}
		} catch (e) {
			console.log(e);
		}
	}

	async function handleDelete() {
		try {
			setErrorMessage(null);

			const { id } = user;

			const result = await deleteUser({ id });

			// check for errors
			if ('error' in result) {
				const error = result.error as ReduxError;
				setErrorMessage(error.data.message);
			} else {
				navigate('/dash/users');
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-2 max-w-md'>
				{errorMessage && (
					<div
						aria-live='assertive'
						role='alert'
						className='px-3 py-2 bg-red-300 rounded'
					>
						{errorMessage}
					</div>
				)}
				<input
					{...register('id')}
					type='hidden'
					id={`${id}-id`}
					value={user.id}
					name='id'
				/>
				<div className='flex flex-col gap-2'>
					<label htmlFor='firstName'>First Name:</label>
					<input
						{...register('firstName')}
						type='text'
						name='firstName'
						id={`${id}-firstName`}
						defaultValue={user.firstName}
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.firstName?.message}
					</span>
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='lastName'>Last Name:</label>
					<input
						{...register('lastName')}
						type='text'
						name='lastName'
						id={`${id}-lastName`}
						defaultValue={user.lastName}
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.lastName?.message}
					</span>
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='email'>Email:</label>
					<input
						{...register('email')}
						type='email'
						name='email'
						id={`${id}-email`}
						defaultValue={user.email}
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.email?.message}
					</span>
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='password'>Password:</label>
					<input
						{...register('password')}
						type='password'
						name='password'
						id={`${id}-password`}
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.password?.message}
					</span>
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='confirmPassword'>Confirm Password:</label>
					<input
						{...register('confirmPassword')}
						type='password'
						name='confirmPassword'
						id={`${id}-confirmPassword`}
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.confirmPassword?.message}
					</span>
				</div>
				<div className='flex justify-end gap-2'>
					<button
						type='submit'
						disabled={isSubmitting || isSubmitting}
						title='Save'
						className='bg-amber-400 enabled:hover:bg-amber-500 disabled:opacity-50 px-2 py-1 rounded'
					>
						Save
					</button>
					<button
						type='button'
						onClick={handleDelete}
						disabled={isLoading || isSubmitting}
						title='Delete'
						className='bg-red-500 enabled:hover:bg-red-600 disabled:opacity-50 px-2 py-1 rounded'
					>
						Delete
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditUserForm;
