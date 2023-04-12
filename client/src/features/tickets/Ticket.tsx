import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import type { EntityId } from '@reduxjs/toolkit';

import { useAppSelector } from '../../app/hooks';
import { selectTicketById } from './ticketsApiSlice';

type Props = {
	ticketId: EntityId | string;
};

function Ticket({ ticketId }: Props) {
	const navigate = useNavigate();

	const ticket = useAppSelector(state => selectTicketById(state, ticketId));

	if (ticket) {
		function handleEdit() {
			navigate(`/dash/tickets/${ticketId}`);
		}

		const owner = `${ticket.owner.firstName} ${ticket.owner.lastName}`;

		return (
			<tr>
				<td className='border border-slate-600'>{ticket.title}</td>
				<td className='border border-slate-600 truncate'>
					{ticket.description}
				</td>
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

export default Ticket;
