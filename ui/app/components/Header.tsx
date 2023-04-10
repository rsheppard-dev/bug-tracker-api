'use client';

import Link from 'next/link';

import { signIn, signOut, useSession } from 'next-auth/react';

function Header() {
	const { data: session } = useSession();
	return (
		<header className='bg-purple-700 min-w-full py-3 mb-5'>
			<div className='container'>
				<div className='flex justify-between text-slate-100'>
					<Link href='/' className='font-bold'>
						Bugscape
					</Link>
					<nav className='flex gap-3'>
						{session?.user ? (
							<>
								<Link href='/welcome'>{session.user.email}</Link>
								<span> | </span>
								<button onClick={() => signOut()}>Logout</button>
							</>
						) : (
							<>
								<Link href='/register'>Register</Link>
								<span>|</span>
								<button onClick={() => signIn()}>Login</button>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}

export default Header;
