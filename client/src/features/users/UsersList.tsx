import User from './User';
import { useGetUsersQuery } from './usersApiSlice';

function UsersList() {
	const { data: users, isLoading, isSuccess, error } = useGetUsersQuery();

	let content;

	// handle loading
	if (isLoading) content = <p>Loading users...</p>;

	// handle errors
	if (error) {
		if ('status' in error) {
			console.log(error.data);
			content = 'error' in error ? error.error : JSON.stringify(error.data);
		} else {
			content = error.message;
		}
	}

	// handle success
	if (isSuccess) {
		const { ids } = users;

		const tableContent = ids?.length
			? ids.map(userId => <User key={userId} userId={userId} />)
			: null;

		content = (
			<table className='table-fixed w-full border-collapse border border-slate-600'>
				<thead className='bg-slate-300'>
					<tr className='text-left'>
						<th className='border border-slate-600'>First Name</th>
						<th className='border border-slate-600'>Last Name</th>
						<th className='border border-slate-600'>Email</th>
						<th className='border border-slate-600'>Role</th>
						<th className='border border-slate-600'>Edit</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}
	return (
		<section className='container'>
			<h1 className='mb-10 font-bold'>Users List</h1>
			<div>{content}</div>
		</section>
	);
}

export default UsersList;
