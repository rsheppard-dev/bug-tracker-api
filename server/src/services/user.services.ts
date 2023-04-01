import type { User } from '../models/user.model';
import { UserModel } from '../models';

export function createUser(user: Partial<User>) {
	return UserModel.create(user);
}

export async function findUserById(id: string) {
	return UserModel.findById(id);
}

export async function findUserByEmail(email: string) {
	return UserModel.findOne({ email });
}
