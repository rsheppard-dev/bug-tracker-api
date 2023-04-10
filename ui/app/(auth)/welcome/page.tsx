'use client';

import { useSession } from 'next-auth/react';

export default function WelcomePage() {
	const { data: session } = useSession();

	console.log(session);
	const welcomeMessage = session?.user
		? `Welcome ${session.user.firstName}!`
		: 'Please login.';
	return (
		<section className='container'>
			<h1>{welcomeMessage}</h1>
		</section>
	);
}
