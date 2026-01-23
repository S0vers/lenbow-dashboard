type TransactionStatusType =
	| "pending"
	| "accepted"
	| "rejected"
	| "partially_paid"
	| "requested_repay"
	| "completed";

interface TransactionInterface {
	id: string;
	publicId: string;
	borrower: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	lender: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	type: "lend" | "borrow";
	amount: number;
	amountPaid: number;
	remainingAmount: number;
	currency: {
		symbol: string;
		name: string;
		code: string;
	};
	reviewAmount: number;
	rejectionReason: string | null;
	requestDate: string | null;
	acceptedAt: string | null;
	completedAt: string | null;
	rejectedAt: string | null;
	status: TransactionStatusType;
	description: string | null;
	dueDate: string | null;
	createdAt: string;
	updatedAt: string;
}
