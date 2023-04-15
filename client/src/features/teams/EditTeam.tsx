import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../app/hooks';
import { selectTeamById } from './teamsApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditTeamForm from './EditTeamForm';

function EditTeam() {
	const { id } = useParams();

	const team = id ? useAppSelector(state => selectTeamById(state, id)) : null;
	const users = useAppSelector(selectAllUsers);

	const content =
		team && users ? (
			<EditTeamForm team={team} users={users} />
		) : (
			<p>Loading...</p>
		);

	return (
		<section className='container'>
			<h1 className='font-bold mb-10'>Edit Team</h1>
			<div>{content}</div>
		</section>
	);
}

export default EditTeam;
