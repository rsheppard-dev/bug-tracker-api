import type { User } from '../models/user.model';
import { UserModel } from '../models';

export function createUser(user: Partial<User>) {
	return UserModel.create(user);
}
