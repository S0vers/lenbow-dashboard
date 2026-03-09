import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";
import type {
	EmailTemplate,
	EmailTemplateType
} from "@/redux/@types/EmailTemplates";
import type {
	CreateEmailTemplateBody,
	UpdateEmailTemplateBody
} from "@/validators/emailTemplates";
import { apiRoute } from "@/routes/routes";

export const emailTemplatesApiSlice = createApi({
	reducerPath: "emailTemplatesApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["EmailTemplate"],
	endpoints: builder => ({
		emailTemplatesList: builder.query<
			ApiResponse<EmailTemplate[]>,
			| void
			| {
					type?: EmailTemplateType;
					search?: string;
					category?: string;
			  }
		>({
			query: paramsArg => {
				const params: Record<string, any> | undefined = paramsArg ?? undefined;
				return {
					url: apiRoute.emailTemplates,
					method: "GET",
					params
				};
			},
			providesTags: ["EmailTemplate"]
		}),

		getEmailTemplateById: builder.query<ApiResponse<EmailTemplate>, { templateId: string }>({
			query: ({ templateId }) => ({
				url: apiRoute.emailTemplate(templateId),
				method: "GET"
			}),
			providesTags: ["EmailTemplate"]
		}),

		createEmailTemplate: builder.mutation<ApiResponse<EmailTemplate>, CreateEmailTemplateBody>({
			query: body => ({
				url: apiRoute.emailTemplates,
				method: "POST",
				body
			}),
			invalidatesTags: ["EmailTemplate"]
		}),

		updateEmailTemplate: builder.mutation<
			ApiResponse<EmailTemplate>,
			{ templateId: string; body: UpdateEmailTemplateBody }
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
		}),

		sendEmailTemplateTest: builder.mutation<
			ApiResponse<null>,
			{ templateId: string; body: { to: string; sampleData?: Record<string, unknown> } }
		>({
			query: ({ templateId, body }) => ({
				url: apiRoute.emailTemplateTestSend(templateId),
				method: "POST",
				body
			})
		})
	})
});

export const {
	useEmailTemplatesListQuery,
	useGetEmailTemplateByIdQuery,
	useLazyGetEmailTemplateByIdQuery,
	useCreateEmailTemplateMutation,
	useUpdateEmailTemplateMutation,
	useDeleteEmailTemplateMutation,
	useSendEmailTemplateTestMutation
} = emailTemplatesApiSlice;

export const emailTemplatesApiReducer = emailTemplatesApiSlice.reducer;

