'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import { axiosAuth } from '../axios';
import useRefreshToken from './useRefreshToken';

function useAxiosAuth() {
	const { data: session } = useSession();
	const refreshToken = useRefreshToken();

	useEffect(() => {
		// check for access token and set auth header
		const requestIntercept = axiosAuth.interceptors.request.use(
			config => {
				if (!config.headers['Authorization']) {
					config.headers[
						'Authorization'
					] = `Bearer ${session?.user?.accessToken}`;
				}
				return config;
			},
			error => Promise.reject(error)
		);

		const responseIntercept = axiosAuth.interceptors.response.use(
			res => res,
			async error => {
				const prevRequest = error.config;

				if (error.response.status === 403 && !prevRequest.sent) {
					prevRequest.sent = true;

					// refresh access token in session state
					await refreshToken();

					// update auth header
					prevRequest.headers[
						'Authorization'
					] = `Bearer ${session?.user?.accessToken}`;

					// retry request with new access token
					return axiosAuth(prevRequest);
				}

				return Promise.reject(error);
			}
		);

		// clean up
		return () => {
			axiosAuth.interceptors.request.eject(requestIntercept);
			axiosAuth.interceptors.response.eject(responseIntercept);
		};
	}, [session, refreshToken]);

	return axiosAuth;
}

export default useAxiosAuth;
