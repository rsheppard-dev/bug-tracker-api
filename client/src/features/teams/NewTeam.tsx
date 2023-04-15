import { useAppSelector } from '../../app/hooks';
import { selectAllUsers } from '../users/usersApiSlice';
import NewTeamForm from './NewTeamForm';

function CreateTeam() {
	const users = useAppSelector(selectAllUsers);

	const content = users ? <NewTeamForm users={users} /> : <p>Loading...</p>;
	return (
		<section className='container'>
			<h1 className='font-bold mb-10'>New Team</h1>
			<div>{content}</div>
		</section>
	);
}

export default CreateTeam;
