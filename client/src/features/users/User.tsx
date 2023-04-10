import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import type { EntityId } from '@reduxjs/toolkit';

import { useAppSelector } from '../../app/hooks';
import { selectUsersById } from './usersApiSlice';

type Props = {
	userId: EntityId;
};

function User({ userId }: Props) {
	const navigate = useNavigate();

	const user = useAppSelector(state => selectUsersById(state, userId));

	if (user) {
		function handleEdit() {
			navigate(`/dash/users/${userId}`);
		}

		return (
			<tr>
				<td className='border border-slate-600'>{user.firstName}</td>
				<td className='border border-slate-600'>{user.lastName}</td>
				<td className='border border-slate-600'>{user.email}</td>
				<td className='border border-slate-600'>
					{JSON.stringify(user.roles)}
				</td>
				<td className='border border-slate-600'>
					<button title='Edit' onClick={handleEdit}>
						<FaEdit />
					</button>
				</td>
			</tr>
		);
	} else return null;
}

export default User;
