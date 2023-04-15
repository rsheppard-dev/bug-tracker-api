import {
	createSelector,
	createEntityAdapter,
	type EntityState,
} from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';
import type { RootState } from '../../app/store';
import type { Team } from '../../../types/team';

const teamsAdapter = createEntityAdapter<Team>({});

const initialState = teamsAdapter.getInitialState();

export const teamsApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getTeams: builder.query<EntityState<Team>, void>({
			query: () => ({
				url: '/team',
				validateStatus: (response, result) =>
					response.status === 200 && !result.isError,
			}),
			transformResponse: (response: Team[]) => {
				return teamsAdapter.addMany(teamsAdapter.getInitialState(), response);
			},
			providesTags: result => {
				if (result?.ids) {
					return [
						{ type: 'Team', id: 'LIST' },
						...result.ids.map(id => ({ type: 'Team' as const, id })),
					];
				} else return [{ type: 'Team', id: 'LIST' }];
			},
		}),

		createNewTeam: builder.mutation<{}, FormData>({
			query: data => ({
				url: '/team',
				method: 'POST',
				credentials: 'include',
				body: data,
			}),
			invalidatesTags: [{ type: 'Team', id: 'LIST' }],
		}),

		updateTeam: builder.mutation<{}, FormData>({
			query: data => ({
				url: '/team',
				method: 'PATCH',
				credentials: 'include',
				body: data,
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Team', id: arg.get('id') as string },
			],
		}),

		deleteTeam: builder.mutation({
			query: ({ id }) => ({
				url: '/team',
				method: 'DELETE',
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Team', id: arg.id }],
		}),
	}),
});

export const {
	useGetTeamsQuery,
	useCreateNewTeamMutation,
	useUpdateTeamMutation,
	useDeleteTeamMutation,
} = teamsApiSlice;

export const selectTeamsResult = teamsApiSlice.endpoints.getTeams.select();

const selectTeamsData = createSelector(
	selectTeamsResult,
	teamsResult => teamsResult.data
);

export const {
	selectAll: selectAllTeams,
	selectById: selectTeamById,
	selectIds: selectTeamIds,
} = teamsAdapter.getSelectors(
	(state: RootState) => selectTeamsData(state) ?? initialState
);
