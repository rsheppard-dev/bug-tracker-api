import {
	createSelector,
	createEntityAdapter,
	type EntityState,
} from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/apiSlice';
import type { RootState } from '../../app/store';
import type { Ticket } from '../../types/ticket';

const ticketsAdapter = createEntityAdapter<Ticket>({
	sortComparer: (a, b) =>
		a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = ticketsAdapter.getInitialState();

export const ticketsApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		getTickets: builder.query<EntityState<Ticket>, void>({
			query: () => ({
				url: '/ticket',
				validateStatus: (response, result) =>
					response.status === 200 && !result.isError,
			}),
			keepUnusedDataFor: 5,
			transformResponse: (response: Ticket[]) => {
				return ticketsAdapter.addMany(
					ticketsAdapter.getInitialState(),
					response
				);
			},
			providesTags: result => {
				if (result?.ids) {
					return [
						{ type: 'Ticket', id: 'LIST' },
						...result.ids.map(id => ({ type: 'Ticket' as const, id })),
					];
				} else return [{ type: 'Ticket', id: 'LIST' }];
			},
		}),
	}),
});

export const { useGetTicketsQuery } = ticketsApiSlice;

export const selectTicketsResult =
	ticketsApiSlice.endpoints.getTickets.select();

const selectTicketsData = createSelector(
	selectTicketsResult,
	ticketsResult => ticketsResult.data
);

export const {
	selectAll: selectAllTickets,
	selectById: selectTicketsById,
	selectIds: selectTicketIds,
} = ticketsAdapter.getSelectors(
	(state: RootState) => selectTicketsData(state) ?? initialState
);
