import axios from 'axios';

const SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT!;

export default axios.create({
	baseURL: SERVER_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const axiosAuth = axios.create({
	baseURL: SERVER_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
});
