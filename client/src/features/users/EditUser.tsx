import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../app/hooks';
import { selectUserById } from './usersApiSlice';
import EditUserForm from './EditUserForm';

function EditUser() {
	const { id } = useParams();

	if (!id) return null;

	const user = useAppSelector(state => selectUserById(state, id));

	const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

	return (
		<section className='container'>
			<h1 className='font-bold mb-10'>Edit User</h1>
			<div>{content}</div>
		</section>
	);
}

export default EditUser;
