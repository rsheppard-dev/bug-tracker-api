import Ticket from './Ticket';
import { useGetTicketsQuery } from './ticketsApiSlice';

function TicketsList() {
	const {
		data: tickets,
		isLoading,
		isSuccess,
		error,
	} = useGetTicketsQuery(undefined, {
		pollingInterval: 15000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});

	let content;

	// handle loading
	if (isLoading) content = <p>Loading tickets...</p>;

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
		const { ids } = tickets;

		const tableContent = ids?.length
			? ids.map(ticketId => <Ticket key={ticketId} ticketId={ticketId} />)
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
			<h1 className='mb-10 font-bold'>Tickets List</h1>
			<div>{content}</div>
		</section>
	);
}

export default TicketsList;
