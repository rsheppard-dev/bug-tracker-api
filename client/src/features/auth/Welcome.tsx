import { Link } from 'react-router-dom';

function Welcome() {
	const date = new Date();
	const today = new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'full',
		timeStyle: 'long',
	}).format(date);
	return (
		<section className='container'>
			<h1 className='mb-10 font-bold'>Welcome</h1>
			<p className='mb-10'>{today}</p>
			<ul className='space-y-3 underline'>
				<li>
					<Link to='/dash/users'>View Users</Link>
				</li>
				<li>
					<Link to='/dash/teams'>View Teams</Link>
				</li>
				<li>
					<Link to='/dash/projects'>View Projects</Link>
				</li>
				<li>
					<Link to='/dash/tickets'>View Tickets</Link>
				</li>
			</ul>
		</section>
	);
}

export default Welcome;
