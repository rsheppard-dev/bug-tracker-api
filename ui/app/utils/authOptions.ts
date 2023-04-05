import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/app/utils/axios';
import { User } from '../interfaces/user';

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				// Add logic here to look up the user from the credentials supplied

				const res: { data: User } = await axios.post('/session', {
					...credentials,
				});

				const user = res.data;

				if (user) {
					if (!user.verified) {
						throw new Error(
							'You must verify your email address to activate your account.'
						);
					}
					// Any object returned will be saved in `user` property of the JWT
					return user;
				} else {
					// If you return null then an error will be displayed advising the user to check their details.
					return null;

					// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},
		async session({ session, token }) {
			session.user = token as any;

			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	debug: process.env.NODE_ENV === 'development',
};
