import { Routes, Route } from 'react-router-dom';

import RootLayout from './components/RootLayout';
import Public from './components/Public';
import Login from './features/auth/Login';
import AuthLayout from './components/AuthLayout';
import Welcome from './features/auth/Welcome';
import UsersList from './features/users/UsersList';
import ProjectsList from './features/projects/ProjectsList';
import TicketsList from './features/tickets/TicketsList';
import TeamsList from './features/teams/TeamsList';
import EditUser from './features/users/EditUser';
import EditTeam from './features/teams/EditTeam';
import CreateUserForm from './features/users/CreateUserForm';
import CreateTeam from './features/teams/CreateTeam';
import Prefetch from './features/auth/Prefetch';

function App() {
	return (
		<Routes>
			<Route path='/' element={<RootLayout />}>
				<Route index element={<Public />} />
				<Route path='login' element={<Login />} />
				<Route path='register' element={<CreateUserForm />} />

				<Route element={<Prefetch />}>
					<Route path='dash' element={<AuthLayout />}>
						<Route index element={<Welcome />} />

						<Route path='users'>
							<Route index element={<UsersList />} />
							<Route path=':id' element={<EditUser />} />
						</Route>

						<Route path='teams'>
							<Route index element={<TeamsList />} />
							<Route path='new' element={<CreateTeam />} />
							<Route path=':id' element={<EditTeam />} />
						</Route>

						<Route path='projects'>
							<Route index element={<ProjectsList />} />
						</Route>

						<Route path='tickets'>
							<Route index element={<TicketsList />} />
						</Route>
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
