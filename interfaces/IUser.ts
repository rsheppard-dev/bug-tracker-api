import type { ObjectId } from 'mongoose';

interface IUser {
	_id: ObjectId | string;
	username: string;
	password: string;
	roles: Roles[];
	active: boolean;
}

enum Roles {
	Basic,
	Manager,
	Admin,
}

export default IUser;
