import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export const overviewApiSlice = createApi({
	reducerPath: "overviewApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Overview"],
	endpoints: builder => ({
		getOverview: builder.query<ApiResponse<OverviewData>, OverviewQueryParams | void>({
			query: params => ({
				url: apiRoute.overview,
				method: "GET",
				params: params || {}
			}),
			providesTags: ["Overview"]
		})
	})
});

export const { useGetOverviewQuery, useLazyGetOverviewQuery } = overviewApiSlice;

export const overviewApiReducer = overviewApiSlice.reducer;
