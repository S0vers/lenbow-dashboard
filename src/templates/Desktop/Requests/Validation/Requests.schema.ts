import z from "zod";

import { validateClientNumber, validateDate, validateString } from "@/validators/commonRule";

export const createRequestsSchema = z.object({
	lenderId: validateString("Account ID", { min: 36, max: 36 }),
	amount: validateClientNumber("Amount"),
	dueDate: validateDate("Due date").optional(),
	description: validateString("Reason", { max: 500 }).optional()
});

export const updatePendingRequestsSchema = z.object({
	amount: validateClientNumber("Amount"),
	dueDate: validateDate("Due date").optional()
});

export const rejectRequestsSchema = z.object({
	rejectionReason: validateString("Rejection Reason", { max: 500 }).optional()
});

export type CreateRequestsSchema = z.infer<typeof createRequestsSchema>;
export type UpdatePendingRequestsSchema = z.infer<typeof updatePendingRequestsSchema>;
export type RejectRequestsSchema = z.infer<typeof rejectRequestsSchema>;
