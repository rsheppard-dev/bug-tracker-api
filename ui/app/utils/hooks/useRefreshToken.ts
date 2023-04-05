'use client';

import { useSession } from 'next-auth/react';
import axios from '../axios';

function useRefreshToken() {
	const { data: session } = useSession();

	async function refreshAccessToken() {
		const {
			data: { accessToken },
		} = await axios.post('/session/refresh', {
			refresh: session?.user?.refreshToken,
		});

		if (session) session.user.accessToken = accessToken;
	}

	return refreshAccessToken;
}

export default useRefreshToken;
