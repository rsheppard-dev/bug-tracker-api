import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function AuthFooter() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	function handleGoHome() {
		navigate('/dash');
	}
	return (
		<footer className='min-w-full bg-purple-700 mt-10 text-white py-3'>
			<div className='container'>
				<div className='flex gap-5 items-center'>
					{pathname !== '/dash' && (
						<button title='Home' onClick={handleGoHome}>
							<FaHome />
						</button>
					)}
					<p>Current User:</p>
					<p>Current Status:</p>
				</div>
			</div>
		</footer>
	);
}

export default AuthFooter;
