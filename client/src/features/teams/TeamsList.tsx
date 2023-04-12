import Team from './Team';
import { useGetTeamsQuery } from './teamsApiSlice';

function TeamsList() {
	const {
		data: teams,
		isLoading,
		isSuccess,
		error,
	} = useGetTeamsQuery(undefined, {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	// handle loading
	if (isLoading) content = <p>Loading teams...</p>;

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
		const { ids } = teams;

		const tableContent = ids?.length
			? ids.map(teamId => <Team key={teamId} teamId={teamId} />)
			: null;

		content = (
			<table className='table-fixed w-full border-collapse border border-slate-600'>
				<thead className='bg-slate-300'>
					<tr className='text-left'>
						<th className='border border-slate-600'>Name</th>
						<th className='border border-slate-600'>Description</th>
						<th className='border border-slate-600'>Owner</th>
						<th className='border border-slate-600'>Edit</th>
					</tr>
				</thead>
				<tbody>{tableContent}</tbody>
			</table>
		);
	}
	return (
		<section className='container'>
			<h1 className='mb-10 font-bold'>Teams List</h1>
			<div>{content}</div>
		</section>
	);
}

export default TeamsList;
