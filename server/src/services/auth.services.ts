import { type DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';

import { SessionModel } from '../models';
import { User } from '../models/user.model';
import { signJwt } from '../utils/jwt';
import { privateFields } from '../models/user.model';

export async function createSession({ userId }: { userId: string }) {
	return SessionModel.create({ user: userId });
}

export async function findSessionById(id: string) {
	return SessionModel.findById(id);
}

export function generateAccessToken(user: DocumentType<User>) {
	const payload = omit(user.toJSON(), privateFields);

	const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
		expiresIn: '10s',
	});

	return accessToken;
}

export async function generateRefreshToken({ userId }: { userId: string }) {
	const session = await createSession({ userId });
	const payload = { session: session._id.toString() };

	const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', {
		expiresIn: '20s',
	});

	return refreshToken;
}
