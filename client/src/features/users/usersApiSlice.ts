import {
	createSelector,
	createEntityAdapter,
	type EntityState,
} from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';
import type { RootState } from '../../app/store';
import { User } from '../../types/user';

const usersAdapter = createEntityAdapter<User>({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getUsers: builder.query<EntityState<User>, void>({
			query: () => ({
				url: '/user',
				validateStatus: (response, result) =>
					response.status === 200 && !result.isError,
			}),
			transformResponse: (response: User[]) => {
				return usersAdapter.addMany(usersAdapter.getInitialState(), response);
			},
			keepUnusedDataFor: 5,
			providesTags: result => {
				if (result?.ids) {
					return [
						{ type: 'User', id: 'LIST' },
						...result.ids.map(id => ({ type: 'User' as const, id })),
					];
				} else {
					return [{ type: 'User', id: 'LIST' }];
				}
			},
		}),
	}),
});

export const { useGetUsersQuery } = usersApiSlice;

export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
	selectUsersResult,
	usersResult => usersResult.data
);

export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
} = usersAdapter.getSelectors(
	(state: RootState) => selectUsersData(state) ?? initialState
);
