import { useState, useId, type ChangeEvent } from 'react';

import { object, string, union, any, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useUpdateTeamMutation, useDeleteTeamMutation } from './teamsApiSlice';
import type { ReduxError } from '../../../types/reduxError';
import type { Team } from '../../../types/team';
import type { User } from '../../../types/user';
import createImageUrl from '../../utils/createImageUrl';

type Props = {
	team: Team;
	users: User[];
};

const MAX_FILE_SIZE = 10 * 1000000;
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
];

const updateTeamSchema = object({
	id: string(),
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
	owner: string(),
});

// get typescript type from schema
type UpdateTeamInput = TypeOf<typeof updateTeamSchema>;

function EditTeamForm({ team, users }: Props) {
	const initialLogo = createImageUrl(
		team?.logo?.data?.data,
		team?.logo?.contentType
	);

	const [logo, setLogo] = useState<string | undefined | null>(initialLogo);
	const [errorMessage, setErrorMessage] = useState<string | null>();

	const id = useId();
	const navigate = useNavigate();

	const [updateTeam] = useUpdateTeamMutation();
	const [deleteTeam, { isLoading }] = useDeleteTeamMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UpdateTeamInput>({
		resolver: zodResolver(updateTeamSchema),
	});

	const onSubmit = async (values: UpdateTeamInput) => {
		try {
			setErrorMessage(null);

			const formData = new FormData();
			values.logo && formData.append('logo', values.logo[0]);
			formData.append('id', values.id);
			values.name && formData.append('name', values.name);
			values.description && formData.append('description', values.description);
			values.owner && formData.append('owner', values.owner);

			const result = await updateTeam(formData);

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

	async function handleDelete() {
		try {
			setErrorMessage(null);

			const { id } = team;

			const result = await deleteTeam({ id });

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
	}

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
			<input
				{...register('id')}
				type='hidden'
				id={`${id}-id`}
				value={team.id}
				name='id'
			/>
			<div className='flex flex-col gap-2'>
				<label htmlFor='name'>Team Name:</label>
				<input
					{...register('name')}
					type='text'
					name='name'
					id={`${id}-name`}
					defaultValue={team.name}
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
					defaultValue={team?.description}
				/>
				<span className='text-red-600' aria-live='assertive' role='alert'>
					{errors?.description?.message}
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
					defaultValue={team.owner.id}
				>
					{options}
				</select>
				<span className='text-red-600' aria-live='assertive' role='alert'>
					{errors.owner?.message}
				</span>
			</div>
			<div className='flex justify-end gap-2'>
				<button
					type='submit'
					disabled={isLoading || isSubmitting}
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
	);
}

export default EditTeamForm;
