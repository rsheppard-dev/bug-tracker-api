import NextAuth from 'next-auth/next';

import { authOptions } from '@/app/utils/authOptions';

export default NextAuth(authOptions);
