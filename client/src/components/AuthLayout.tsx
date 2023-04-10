import { Outlet } from 'react-router-dom';

import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

function AuthLayout() {
	return (
		<div className='min-h-screen flex flex-col'>
			<AuthHeader />
			<div className='grow'>
				<Outlet />
			</div>
			<AuthFooter />
		</div>
	);
}

export default AuthLayout;
