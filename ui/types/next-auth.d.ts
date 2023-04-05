import NextAuth from 'next-auth/next';

declare module 'next-auth' {
	interface Session {
		user: {
			_id: string;
			email: string;
			firstName: string;
			lastName: string;
			roles: string;
			createdAt: Date;
			updatedAt: Date;
			sessionId: string;
			accessToken: string;
			refreshToken: string;
		};
	}
}
