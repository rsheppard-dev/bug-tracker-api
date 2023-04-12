import { useState, useId } from 'react';

import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCreateNewUserMutation } from './usersApiSlice';
import { ReduxError } from '../../../types/reduxError';

const createUserSchema = object({
	firstName: string()
		.nonempty({ message: 'First name is required.' })
		.min(2, 'First name must be at least 2 characters long.')
		.max(30, 'First name  cannot be longer than 30 characters.'),
	lastName: string()
		.nonempty({ message: 'Last name is required.' })
		.min(2, 'Last name must be at least 2 characters long.')
		.max(30, 'Last name  cannot be longer than 30 characters.'),
	email: string()
		.nonempty({ message: 'Email is required.' })
		.email('You must enter a valid email address.'),
	password: string()
		.nonempty({ message: 'Password is required.' })
		.min(8, 'Password must be a minimum of 8 characters.'),
	confirmPassword: string().nonempty({
		message: 'Confirm password is required.',
	}),
}).refine(data => data.password === data.confirmPassword, {
	message: 'Passwords do not match.',
	path: ['confirmPassword'],
});

// get typescript type from schema
type CreateUserInput = TypeOf<typeof createUserSchema>;

function CreateUserForm() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const id = useId();
	const navigate = useNavigate();

	const [createNewUser] = useCreateNewUserMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateUserInput>({
		resolver: zodResolver(createUserSchema),
	});

	async function onSubmit(values: CreateUserInput) {
		try {
			setErrorMessage(null);

			const result = await createNewUser(values);

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
		<div className='container'>
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
				<div className='flex flex-col gap-2'>
					<label htmlFor='firstName'>First Name:</label>
					<input
						{...register('firstName')}
						type='text'
						name='firstName'
						id={`${id}-firstName`}
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
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={isSubmitting}
						title='Register'
						className='bg-amber-400 enabled:hover:bg-amber-500 disabled:opacity-50 px-2 py-1 rounded'
					>
						Register
					</button>
				</div>
			</form>
		</div>
	);
}

export default CreateUserForm;
