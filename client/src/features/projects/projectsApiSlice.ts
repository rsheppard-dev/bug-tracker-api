import {
	createSelector,
	createEntityAdapter,
	type EntityState,
} from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';
import type { RootState } from '../../app/store';
import type { Project } from '../../types/project';

const projectsAdapter = createEntityAdapter<Project>({});

const initialState = projectsAdapter.getInitialState();

export const projectsApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getProjects: builder.query<EntityState<Project>, void>({
			query: () => ({
				url: '/project',
				validateStatus: (response, result) =>
					response.status === 200 && !result.isError,
			}),
			keepUnusedDataFor: 5,
			transformResponse: (response: Project[]) => {
				return projectsAdapter.addMany(
					projectsAdapter.getInitialState(),
					response
				);
			},
			providesTags: result => {
				if (result?.ids) {
					return [
						{ type: 'Project', id: 'LIST' },
						...result.ids.map(id => ({ type: 'Project' as const, id })),
					];
				} else return [{ type: 'Project', id: 'LIST' }];
			},
		}),
	}),
});

export const { useGetProjectsQuery } = projectsApiSlice;

export const selectProjectsResult =
	projectsApiSlice.endpoints.getProjects.select();

const selectProjectsData = createSelector(
	selectProjectsResult,
	projectsResult => projectsResult.data
);

export const {
	selectAll: selectAllProjects,
	selectById: selectProjectById,
	selectIds: selectProjectIds,
} = projectsAdapter.getSelectors(
	(state: RootState) => selectProjectsData(state) ?? initialState
);
