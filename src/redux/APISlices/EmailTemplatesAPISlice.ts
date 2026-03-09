import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";
import type { EmailTemplate } from "@/redux/@types/EmailTemplates";
import { apiRoute } from "@/routes/routes";

export const emailTemplatesApiSlice = createApi({
	reducerPath: "emailTemplatesApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["EmailTemplate"],
	endpoints: builder => ({
		emailTemplatesList: builder.query<ApiResponse<EmailTemplate[]>, void>({
			query: () => ({
				url: apiRoute.emailTemplates,
				method: "GET"
			}),
			providesTags: ["EmailTemplate"]
		}),

		getEmailTemplateById: builder.query<ApiResponse<EmailTemplate>, { templateId: string }>({
			query: ({ templateId }) => ({
				url: apiRoute.emailTemplate(templateId),
				method: "GET"
			}),
			providesTags: ["EmailTemplate"]
		}),

		createEmailTemplate: builder.mutation<ApiResponse<EmailTemplate>, Partial<EmailTemplate>>({
			query: body => ({
				url: apiRoute.emailTemplates,
				method: "POST",
				body
			}),
			invalidatesTags: ["EmailTemplate"]
		}),

		updateEmailTemplate: builder.mutation<
			ApiResponse<EmailTemplate>,
			{ templateId: string; body: Partial<EmailTemplate> }
		>({
			query: ({ templateId, body }) => ({
				url: apiRoute.emailTemplate(templateId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["EmailTemplate"]
		}),

		deleteEmailTemplate: builder.mutation<ApiResponse<string | null>, { templateId: string }>({
			query: ({ templateId }) => ({
				url: apiRoute.emailTemplate(templateId),
				method: "DELETE"
			}),
			invalidatesTags: ["EmailTemplate"]
		})
	})
});

export const {
	useEmailTemplatesListQuery,
	useGetEmailTemplateByIdQuery,
	useLazyGetEmailTemplateByIdQuery,
	useCreateEmailTemplateMutation,
	useUpdateEmailTemplateMutation,
	useDeleteEmailTemplateMutation
} = emailTemplatesApiSlice;

export const emailTemplatesApiReducer = emailTemplatesApiSlice.reducer;

