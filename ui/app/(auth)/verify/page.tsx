'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TypeOf, string, object } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '@/app/utils/axios';
import { User } from '@/app/interfaces/user';

const SERVER = process.env.NEXT_PUBLIC_SERVER_ENDPOINT!;

// create validation schema
const verificationSchema = object({
	id: string().nonempty({ message: 'User ID is required.' }),
	verificationCode: string()
		.nonempty({ message: 'Verification code is required.' })
		.length(6, { message: 'Verification code must consist of 6 characters.' }),
});

// infer typescript type from schema
type VerificationInput = TypeOf<typeof verificationSchema>;
type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function VerifyPage({ searchParams }: Props) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();

	const { id, code } = searchParams;

	// setup form validation with zod schema
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<VerificationInput>({
		resolver: zodResolver(verificationSchema),
	});

	// function to run when form successfully submitted
	async function onSubmit(values: VerificationInput) {
		try {
			await axios.get<User>(
				`${SERVER}/user/verify/${values.id}/${values.verificationCode}`
			);

			router.push('/login');
		} catch (e: any) {
			console.log(e);
			setErrorMessage(e.response.data.message);
		}
	}
	return (
		<section className='container'>
			<h1 className='font-bold text-xl mb-10'>Verify Your Email</h1>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-2 max-w-md'>
				<input
					{...register('id')}
					type='hidden'
					name='id'
					defaultValue={id}
					id='id'
				/>
				<div
					aria-live='assertive'
					role='alert'
					className='px-3 py-2 bg-red-300 rounded'
				>
					{errorMessage}
				</div>
				<div className='flex flex-col gap-2'>
					<label htmlFor='verificationCode'>Verification Code:</label>
					<input
						{...register('verificationCode')}
						type='text'
						name='verificationCode'
						defaultValue={code}
						id='verificationCode'
					/>
					<span className='text-red-600' aria-live='assertive' role='alert'>
						{errors.verificationCode?.message}
					</span>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						disabled={isSubmitting}
						title='Verify'
						className='bg-amber-400 enabled:hover:bg-amber-500 disabled:opacity-50 px-2 py-1 rounded'
					>
						Verify
					</button>
				</div>
			</form>
		</section>
	);
}
