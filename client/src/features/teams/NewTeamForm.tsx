import { useState, useId, type ChangeEvent } from 'react';

import z, {
	object,
	string,
	number,
	intersection,
	union,
	any,
	nativeEnum,
	TypeOf,
} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useCreateNewTeamMutation } from './teamsApiSlice';
import type { ReduxError } from '../../../types/reduxError';
import type { User } from '../../../types/user';

const MAX_FILE_SIZE = 10 * 1000000;
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const createTeamSchema = object({
	name: string()
		.nonempty({ message: 'Team name is required.' })
		.min(2, 'Team name must be at least 2 characters long.')
		.max(30, 'Team name  cannot be longer than 30 characters.'),
	description: union([
		string().min(2, 'Description must consist of at least 10 characters.'),
		string().length(0),
	]).optional(),
	logo: any().optional(),
	owner: string().nonempty({ message: 'Owner is required.' }),
});

// get typescript type from schema
type CreateTeamInput = TypeOf<typeof createTeamSchema>;

type Props = {
	users: User[];
};

function NewTeamForm({ users }: Props) {
	const [errorMessage, setErrorMessage] = useState<string | null>();
	const [logo, setLogo] = useState<string | undefined>();
	const id = useId();
	const navigate = useNavigate();

	const [createNewTeam] = useCreateNewTeamMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateTeamInput>({
		resolver: zodResolver(createTeamSchema),
	});

	const onSubmit = async (values: CreateTeamInput) => {
		try {
			setErrorMessage(null);

			const formData = new FormData();
			values.logo[0] && formData.append('logo', values.logo[0]);
			formData.append('owner', values.owner);
			formData.append('name', values.name);
			values.description && formData.append('description', values.description);

			const result = await createNewTeam(formData);

			// check for errors
			if ('error' in result) {
				const error = result.error as ReduxError;
				setErrorMessage(error.data.message);
			} else {
				navigate('/dash/teams');
			}
		} catch (e) {
			console.log(e);
		}
	};

	const options = users.map(user => {
		return (
			<option key={user.id} value={user.id}>
				{`${user.firstName} ${user.lastName}`}
			</option>
		);
	});

	const handleLogoPreview = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const target = e.target.files[0];
			setLogo(URL.createObjectURL(target));
		}
	};

	return (
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
				<label htmlFor='name'>Team Name:</label>
				<input
					{...register('name')}
					type='text'
					name='name'
					id={`${id}-name`}
				/>
				<span className='text-red-600' aria-live='assertive' role='alert'>
					{errors.name?.message}
				</span>
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='description'>Description:</label>
				<input
					{...register('description')}
					type='text'
					name='description'
					id={`${id}-description`}
				/>
				<span className='text-red-600' aria-live='assertive' role='alert'>
					{errors.description?.message}
				</span>
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='logo'>Logo:</label>
				<input
					{...register('logo')}
					type='file'
					name='logo'
					id='logo'
					accept='image/*'
					onChange={handleLogoPreview}
				/>
				{logo ? <img src={logo} width='250' /> : null}
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='owner'>Owner:</label>
				<select
					{...register('owner')}
					id={`${id}-owner`}
					name='owner'
					defaultValue={users[0].id}
				>
					{options}
				</select>
				<span className='text-red-600' aria-live='assertive' role='alert'>
					{errors.owner?.message}
				</span>
			</div>
			<div className='flex justify-end'>
				<button
					type='submit'
					disabled={isSubmitting}
					title='Create'
					className='bg-amber-400 enabled:hover:bg-amber-500 disabled:opacity-50 px-2 py-1 rounded'
				>
					Create
				</button>
			</div>
		</form>
	);
}

export default NewTeamForm;
