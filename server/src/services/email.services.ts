import type { DocumentType } from '@typegoose/typegoose';

import sendMail from '../utils/mail';
import type { User } from '../models/user.model';

export function sendVerificationEmail(user: DocumentType<User>) {
	const text = `Hi ${user.firstName},\n\nThank you for signing up to Bugscape!\nBefore you get started please verify your account.\n\nVerification code: ${user.verificationCode}\n\nClick the link below to verify your account:\n\n${process.env.BASE_URL}/verify?id=${user.id}&code=${user.verificationCode}`;

	// sendMail({
	// 	from: 'noreply@bugscape.net',
	// 	to: user.email,
	// 	subject: 'Please verify your account',
	// 	text,
	// });

	console.log(text);
}
