import { type DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';
import type { FilterQuery, UpdateQuery } from 'mongoose';

import { SessionModel } from '../models';
import { User } from '../models/user.model';
import { signJwt } from '../utils/jwt';
import { privateFields } from '../models/user.model';
import { Session } from '../models/session.model';

export async function createSession(userId: string, userAgent?: string) {
	return SessionModel.create({ userId, userAgent });
}

export async function findSessionById(id: string) {
	return SessionModel.findById(id);
}

export async function findSessions(query: FilterQuery<Session>) {
	return SessionModel.find(query).lean();
}

export async function updateSession(
	query: FilterQuery<Session>,
	update: UpdateQuery<Session>
) {
	return SessionModel.updateOne(query, update);
}

export function generateAccessToken(
	user: DocumentType<User>,
	sessionId: string
) {
	const payload = {
		...omit(user.toJSON(), privateFields),
		sessionId,
	};

	const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
		expiresIn: '15m',
	});

	return accessToken;
}

export async function generateRefreshToken(userId: string, sessionId: string) {
	const payload = {
		userId,
		sessionId,
	};

	const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', {
		expiresIn: '1y',
	});

	return refreshToken;
}
