import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export const budgetApiSlice = createApi({
	reducerPath: "budgetApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["BudgetCategories", "BudgetTransactions", "BudgetSubscriptions"],
	endpoints: builder => ({
		// Categories
		getBudgetCategories: builder.query<ApiResponse<BudgetCategory[]>, void>({
			query: () => ({
				url: apiRoute.budgetCategories,
				method: "GET"
			}),
			providesTags: ["BudgetCategories"]
		}),
		getBudgetCategory: builder.query<ApiResponse<BudgetCategory>, string>({
			query: publicId => ({
				url: `${apiRoute.budgetCategories}/${publicId}`,
				method: "GET"
			}),
			providesTags: (_result, _err, id) => [{ type: "BudgetCategories", id }]
		}),
		createBudgetCategory: builder.mutation<ApiResponse<BudgetCategory>, CreateBudgetCategoryBody>({
			query: body => ({
				url: apiRoute.budgetCategories,
				method: "POST",
				body
			}),
			invalidatesTags: ["BudgetCategories"]
		}),
		updateBudgetCategory: builder.mutation<
			ApiResponse<BudgetCategory>,
			{ publicId: string; body: UpdateBudgetCategoryBody }
		>({
			query: ({ publicId, body }) => ({
				url: `${apiRoute.budgetCategories}/${publicId}`,
				method: "PATCH",
				body
			}),
			invalidatesTags: ["BudgetCategories"]
		}),
		deleteBudgetCategory: builder.mutation<ApiResponse<null>, string>({
			query: publicId => ({
				url: `${apiRoute.budgetCategories}/${publicId}`,
				method: "DELETE"
			}),
			invalidatesTags: ["BudgetCategories"]
		}),

		// Transactions
		getBudgetTransactions: builder.query<
			ApiResponse<BudgetTransaction[]>,
			BudgetTransactionQueryParams | void
		>({
			query: params => ({
				url: apiRoute.budgetTransactions,
				method: "GET",
				params: params || {}
			}),
			providesTags: ["BudgetTransactions"]
		}),
		getBudgetTransaction: builder.query<ApiResponse<BudgetTransaction>, string>({
			query: publicId => ({
				url: apiRoute.budgetTransaction(publicId),
				method: "GET"
			}),
			providesTags: (_result, _err, id) => [{ type: "BudgetTransactions", id }]
		}),
		createBudgetTransaction: builder.mutation<
			ApiResponse<BudgetTransaction>,
			CreateBudgetTransactionBody
		>({
			query: body => ({
				url: apiRoute.budgetTransactions,
				method: "POST",
				body
			}),
			invalidatesTags: ["BudgetTransactions"]
		}),
		updateBudgetTransaction: builder.mutation<
			ApiResponse<BudgetTransaction>,
			{ publicId: string; body: UpdateBudgetTransactionBody }
		>({
			query: ({ publicId, body }) => ({
				url: apiRoute.budgetTransaction(publicId),
				method: "PATCH",
				body
			}),
			invalidatesTags: ["BudgetTransactions"]
		}),
		deleteBudgetTransaction: builder.mutation<ApiResponse<null>, string>({
			query: publicId => ({
				url: apiRoute.budgetTransaction(publicId),
				method: "DELETE"
			}),
			invalidatesTags: ["BudgetTransactions"]
		}),
		attachReceipt: builder.mutation<
			ApiResponse<null>,
			{ transactionPublicId: string; mediaPublicId: string }
		>({
			query: ({ transactionPublicId, mediaPublicId }) => ({
				url: `${apiRoute.budgetTransaction(transactionPublicId)}/receipts/${mediaPublicId}`,
				method: "POST"
			}),
			invalidatesTags: ["BudgetTransactions"]
		}),
		detachReceipt: builder.mutation<
			ApiResponse<null>,
			{ transactionPublicId: string; mediaPublicId: string }
		>({
			query: ({ transactionPublicId, mediaPublicId }) => ({
				url: `${apiRoute.budgetTransaction(transactionPublicId)}/receipts/${mediaPublicId}`,
				method: "DELETE"
			}),
			invalidatesTags: ["BudgetTransactions"]
		}),

		// Subscriptions
		getBudgetSubscriptions: builder.query<ApiResponse<BudgetSubscription[]>, void>({
			query: () => ({
				url: apiRoute.budgetSubscriptions,
				method: "GET"
			}),
			providesTags: ["BudgetSubscriptions"]
		}),
		getBudgetSubscription: builder.query<ApiResponse<BudgetSubscription>, string>({
			query: publicId => ({
				url: apiRoute.budgetSubscription(publicId),
				method: "GET"
			}),
			providesTags: (_result, _err, id) => [{ type: "BudgetSubscriptions", id }]
		}),
		createBudgetSubscription: builder.mutation<
			ApiResponse<BudgetSubscription>,
			CreateBudgetSubscriptionBody
		>({
			query: body => ({
				url: apiRoute.budgetSubscriptions,
				method: "POST",
				body
			}),
			invalidatesTags: ["BudgetSubscriptions"]
		}),
		updateBudgetSubscription: builder.mutation<
			ApiResponse<BudgetSubscription>,
			{ publicId: string; body: UpdateBudgetSubscriptionBody }
		>({
			query: ({ publicId, body }) => ({
				url: apiRoute.budgetSubscription(publicId),
				method: "PATCH",
				body
			}),
			invalidatesTags: ["BudgetSubscriptions"]
		}),
		deleteBudgetSubscription: builder.mutation<ApiResponse<null>, string>({
			query: publicId => ({
				url: apiRoute.budgetSubscription(publicId),
				method: "DELETE"
			}),
			invalidatesTags: ["BudgetSubscriptions"]
		})
	})
});

export const {
	useGetBudgetCategoriesQuery,
	useGetBudgetCategoryQuery,
	useCreateBudgetCategoryMutation,
	useUpdateBudgetCategoryMutation,
	useDeleteBudgetCategoryMutation,
	useGetBudgetTransactionsQuery,
	useGetBudgetTransactionQuery,
	useCreateBudgetTransactionMutation,
	useUpdateBudgetTransactionMutation,
	useDeleteBudgetTransactionMutation,
	useAttachReceiptMutation,
	useDetachReceiptMutation,
	useGetBudgetSubscriptionsQuery,
	useGetBudgetSubscriptionQuery,
	useCreateBudgetSubscriptionMutation,
	useUpdateBudgetSubscriptionMutation,
	useDeleteBudgetSubscriptionMutation
} = budgetApiSlice;

export const budgetApiReducer = budgetApiSlice.reducer;
