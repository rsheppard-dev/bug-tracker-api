import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import type { EntityId } from '@reduxjs/toolkit';

import { useAppSelector } from '../../app/hooks';
import { selectTeamById } from './teamsApiSlice';

type Props = {
	teamId: EntityId | string;
};

function Team({ teamId }: Props) {
	const navigate = useNavigate();

	const team = useAppSelector(state => selectTeamById(state, teamId));

	if (team) {
		function handleEdit() {
			navigate(`/dash/teams/${teamId}`);
		}

		const owner = `${team.owner.firstName} ${team.owner.lastName}`;

		return (
			<tr>
				<td className='border border-slate-600'>{team.name}</td>
				<td className='border border-slate-600 truncate'>{team.description}</td>
				<td className='border border-slate-600'>{owner}</td>
				<td className='border border-slate-600'>
					<button title='Edit' onClick={handleEdit}>
						<FaEdit />
					</button>
				</td>
			</tr>
		);
	} else return null;
}

export default Team;
