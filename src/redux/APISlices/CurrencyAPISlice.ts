import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import { CurrencyUpdateSchema } from "@/templates/Authentication/Profile/Validation/Profile.schema";

export interface Currency {
	symbol: string;
	name: string;
	code: string;
}

export const currencyApiSlice = createApi({
	reducerPath: "currencyApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Currency"],
	endpoints: builder => ({
		currencyList: builder.query<ApiResponse<Currency[]>, void>({
			query: () => ({
				url: apiRoute.currency,
				method: "GET"
			}),
			providesTags: ["Currency"]
		}),

		updateUserCurrency: builder.mutation<ApiResponse<boolean>, CurrencyUpdateSchema>({
			query: ({ currency }) => ({
				url: apiRoute.currency,
				method: "PUT",
				body: { currency }
			}),
			invalidatesTags: ["Currency"]
		})
	})
});

// Export hooks
export const { useCurrencyListQuery, useUpdateUserCurrencyMutation } = currencyApiSlice;

export const currencyApiReducer = currencyApiSlice.reducer;
