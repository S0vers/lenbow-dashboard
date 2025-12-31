import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import {
	CreateRequestsSchema,
	UpdatePendingRequestsSchema
} from "@/templates/Requests/Validation/Requests.schema";

export interface ConnectedContactList {
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	phone: string | null;
	connectedAt: Date;
}

export const transactionApiSlice = createApi({
	reducerPath: "transactionApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Transaction", "TransactionContacts", "TransactionContact"],
	endpoints: builder => ({
		transactionRequestsList: builder.query<
			ApiResponse<RequestsInterface[]>,
			Partial<ApiSearchParams>
		>({
			query: params => ({
				url: apiRoute.requestedTransactions,
				method: "GET",
				params
			}),
			providesTags: ["Transaction"]
		}),

		createTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			CreateRequestsSchema
		>({
			query: body => ({
				url: apiRoute.transactions,
				method: "POST",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		getTransactionById: builder.query<ApiResponse<RequestsInterface>, { transactionId: string }>({
			query: ({ transactionId }) => ({
				url: apiRoute.transaction(transactionId),
				method: "GET"
			}),
			providesTags: ["Transaction"]
		}),

		transactionContactsList: builder.query<ApiResponse<ConnectedContactList[]>, void>({
			query: () => ({
				url: apiRoute.transactionConnectedContacts,
				method: "GET"
			}),
			providesTags: ["TransactionContacts"]
		}),

		getTransactionContactById: builder.query<ApiResponse<ConnectedContactList>, { userId: string }>(
			{
				query: ({ userId }) => ({
					url: apiRoute.transactionContact(userId),
					method: "GET"
				}),
				providesTags: ["TransactionContact"]
			}
		),

		updatePendingTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string; body: UpdatePendingRequestsSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updatePendingTransactionRequest(transactionId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		deleteTransactionRequest: builder.mutation<
			ApiResponse<string | null>,
			{ transactionIds: string[] }
		>({
			query: body => ({
				url: apiRoute.transactions,
				method: "DELETE",
				body
			}),
			invalidatesTags: ["Transaction"]
		})
	})
});

// Export hooks
export const {
	useTransactionRequestsListQuery,
	useCreateTransactionRequestMutation,
	useGetTransactionByIdQuery,
	useLazyGetTransactionByIdQuery,
	useTransactionContactsListQuery,
	useLazyGetTransactionContactByIdQuery,
	useUpdatePendingTransactionRequestMutation,
	useDeleteTransactionRequestMutation
} = transactionApiSlice;

export const transactionApiReducer = transactionApiSlice.reducer;
