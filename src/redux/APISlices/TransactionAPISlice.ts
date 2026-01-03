import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import { PartialRepayBorrowSchema } from "@/templates/Desktop/Borrow/Validation/Borrow.schema";
import {
	CreateRequestsSchema,
	UpdatePendingRequestsSchema,
	ValidateUpdateStatusTransactionSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

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

		updateTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string; body: UpdatePendingRequestsSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updateTransactionRequest(transactionId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		updateTransactionStatus: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string; body: ValidateUpdateStatusTransactionSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updateTransactionStatus(transactionId),
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
		}),

		transactionBorrowList: builder.query<ApiResponse<RequestsInterface[]>, void>({
			query: () => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					type: "borrow",
					status: "accepted,partially_paid"
				}
			}),
			providesTags: ["Transaction"]
		}),

		completeRepaymentTransaction: builder.mutation<
			ApiResponse<string | null>,
			{ transactionIds: string[] }
		>({
			query: body => ({
				url: apiRoute.completeRepaymentTransaction,
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		partialRepaymentTransaction: builder.mutation<
			ApiResponse<string | null>,
			{ transactionId: string; body: PartialRepayBorrowSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.partialRepaymentTransaction(transactionId),
				method: "PUT",
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
	useUpdateTransactionRequestMutation,
	useDeleteTransactionRequestMutation,
	useTransactionBorrowListQuery,
	useCompleteRepaymentTransactionMutation,
	usePartialRepaymentTransactionMutation,
	useUpdateTransactionStatusMutation
} = transactionApiSlice;

export const transactionApiReducer = transactionApiSlice.reducer;
