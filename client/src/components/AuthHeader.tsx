import { Link } from 'react-router-dom';

function AuthHeader() {
	return (
		<header className='min-w-full bg-purple-700 text-white mb-10 py-3'>
			<div className='container'>
				<div className='flex justify-between items-center'>
					<Link className='font-bold' to='/dash'>
						Bugscape
					</Link>
					<nav className='flex gap-3'>
						<Link to='/login'>Login</Link>
						<span>|</span>
						<Link to='/register'>Register</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}

export default AuthHeader;
