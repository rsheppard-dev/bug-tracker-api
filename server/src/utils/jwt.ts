import { sign, verify, type SignOptions } from 'jsonwebtoken';
import config from 'config';

export function signJwt(
	object: Object,
	privateKey: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
	options?: SignOptions | undefined
) {
	// decode key from base64 encryption
	const key = Buffer.from(config.get<string>(privateKey), 'base64').toString(
		'ascii'
	);

	// generate token with payload, private key and options
	return sign(object, key, {
		...(options && options),
		algorithm: 'RS256',
	});
}

export function verifyJwt<T>(
	token: string,
	publicKey: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): { valid: boolean; expired: boolean; decoded: T | null } {
	// decode key from base64 encryption
	const key = Buffer.from(config.get<string>(publicKey), 'base64').toString(
		'ascii'
	);

	// use token and public key to decode jwt then return payload or null
	try {
		const decoded = verify(token, key, { algorithms: ['RS256'] }) as T;
		return {
			valid: true,
			expired: false,
			decoded,
		};
	} catch (e: any) {
		console.log(e);
		return {
			valid: false,
			expired: e.message === 'jwt expired',
			decoded: null,
		};
	}
}
