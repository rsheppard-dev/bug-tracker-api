'use client';

import { useId, useState } from 'react';

import { TypeOf, string, object } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// create validation schema
const loginSchema = object({
	email: string()
		.nonempty({ message: 'Email is required.' })
		.email({ message: 'You must supply a valid email address.' }),
	password: string().nonempty({ message: 'Password is required.' }),
});

// infer typescript type from schema
type LoginInput = TypeOf<typeof loginSchema>;

function Login() {
	const [errorMessage, setErrorMessage] = useState<string | null>();
	const id = useId();

	// setup form validation with zod schema
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	// function to run when form successfully submitted
	async function onSubmit(values: LoginInput) {
		try {
			console.log(values);
		} catch (e: any) {
			console.log('Error', e);
			setErrorMessage(e.data.message);
		}
	}

	return (
		<div className='container'>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-2 max-w-md'>
				{errorMessage && (
					<div
						aria-live='assertive'
						role='alert'
						className='bg-red-600 rounded px-4 py-2 text-white'
					>
						{errorMessage}
					</div>
				)}
				<div className='flex flex-col gap-2'>
					<label htmlFor='email'>Email:</label>
					<input
						{...register('email')}
						type='email'
						name='email'
						id={`${id}-email`}
					/>
					{errors.email && (
						<span className='text-red-600' aria-live='assertive' role='alert'>
							{errors.email?.message}
						</span>
					)}
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='password'>Password:</label>
					<input
						{...register('password')}
						type='password'
						name='password'
						id={`${id}-password`}
					/>
					{errors.password && (
						<span className='text-red-600' aria-live='assertive' role='alert'>
							{errors.password?.message}
						</span>
					)}
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={isSubmitting}
						title='Login'
						className='bg-amber-400 enabled:hover:bg-amber-500 disabled:opacity-50 px-2 py-1 rounded'
					>
						Login
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
