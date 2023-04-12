import { useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { store } from '../../app/store';
import { usersApiSlice } from '../users/usersApiSlice';
import { teamsApiSlice } from '../teams/teamsApiSlice';
import { projectsApiSlice } from '../projects/projectsApiSlice';
import { ticketsApiSlice } from '../tickets/ticketsApiSlice';

function Prefetch() {
	useEffect(() => {
		console.log('Subscribing');
		const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
		const teams = store.dispatch(teamsApiSlice.endpoints.getTeams.initiate());
		const projects = store.dispatch(
			projectsApiSlice.endpoints.getProjects.initiate()
		);
		const tickets = store.dispatch(
			ticketsApiSlice.endpoints.getTickets.initiate()
		);

		return () => {
			console.log('Unsubscribing');
			users.unsubscribe();
			teams.unsubscribe();
			projects.unsubscribe();
			tickets.unsubscribe();
		};
	}, []);
	return <Outlet />;
}

export default Prefetch;
