import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_SERVER_ENDPOINT;

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl }),
	tagTypes: ['User', 'Team', 'Project', 'Ticket', 'Comment'],
	endpoints: builder => ({}),
});
