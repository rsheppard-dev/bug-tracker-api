'use client';

import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';

import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { type AxiosError } from 'axios';
import { User } from '@/app/interfaces/user';

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

function RegisterPage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const id = useId();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateUserInput>({
		resolver: zodResolver(createUserSchema),
	});

	async function onSubmit(values: CreateUserInput) {
		const SERVER = process.env.NEXT_PUBLIC_SERVER_ENDPOINT!;

		try {
			const { data } = await axios.post<User>(`${SERVER}/user`, values);
			router.push(`/verify?id=${data.id}`);
		} catch (e) {
			const error = e as AxiosError;
			console.log(error);
			setErrorMessage(error.message);
		}
	}

	return (
		<div className='container'>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-2 max-w-md'>
				<div aria-live='assertive' role='alert' className='bg-red-300 rounded'>
					{errorMessage}
				</div>
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

export default RegisterPage;
