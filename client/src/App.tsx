import { Routes, Route } from 'react-router-dom';

import RootLayout from './components/RootLayout';
import Public from './components/Public';
import Login from './features/auth/Login';
import AuthLayout from './components/AuthLayout';
import Welcome from './features/auth/Welcome';
import UsersList from './features/users/UsersList';
import ProjectsList from './features/projects/ProjectsList';
import TicketsList from './features/tickets/TicketsList';
import Register from './features/auth/Register';

function App() {
	return (
		<Routes>
			<Route path='/' element={<RootLayout />}>
				<Route index element={<Public />} />
				<Route path='login' element={<Login />} />
				<Route path='register' element={<Register />} />

				<Route path='dash' element={<AuthLayout />}>
					<Route index element={<Welcome />} />

					<Route path='users'>
						<Route index element={<UsersList />} />
					</Route>

					<Route path='projects'>
						<Route index element={<ProjectsList />} />
					</Route>

					<Route path='tickets'>
						<Route index element={<TicketsList />} />
					</Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
