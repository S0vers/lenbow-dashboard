interface MetricsData {
	totalBorrowed: number;
	totalLent: number;
	pendingRequests: number;
	overdueCount: number;
	overdueBorrowed: number;
	overdueLent: number;
	totalContacts: number;
	repaymentRequests: number;
}

interface ActionRequiredItem {
	type: "pending_request" | "repayment_request" | "overdue_loan" | "updated_transaction";
	transactionId: string;
	amount: number;
	currency: {
		code: string;
		name: string;
		symbol: string;
	};
	otherParty: {
		name: string | null;
		email: string;
		image: string | null;
	};
	daysOverdue?: number;
	dueDate?: string | null;
	status: "pending" | "accepted" | "rejected" | "partially_paid" | "requested_repay" | "completed";
	userRole: "borrower" | "lender";
	requestDate: string;
}

interface StatusDistribution {
	pending: number;
	accepted: number;
	partially_paid: number;
	completed: number;
	rejected: number;
	requested_repay: number;
}

interface MonthlyActivity {
	month: string;
	borrowed: number;
	lent: number;
}

interface ChartData {
	statusDistributionAsBorrower: StatusDistribution;
	statusDistributionAsLender: StatusDistribution;
	monthlyActivity: MonthlyActivity[];
}

interface RecentTransaction {
	id: string;
	amount: number;
	currency: {
		code: string;
		name: string;
		symbol: string;
	};
	status: "pending" | "accepted" | "rejected" | "partially_paid" | "requested_repay" | "completed";
	type: "borrow" | "lend";
	otherParty: {
		name: string | null;
		email: string;
		image: string | null;
	};
	date: string;
	dueDate?: string | null;
	description?: string | null;
}

interface UpcomingDueDate {
	id: string;
	amount: number;
	remainingAmount: number;
	currency: {
		code: string;
		name: string;
		symbol: string;
	};
	dueDate: string;
	type: "borrow" | "lend";
	otherParty: {
		name: string | null;
		email: string;
		image: string | null;
	};
	daysUntilDue: number;
	urgency: "high" | "medium" | "low";
	status: "pending" | "accepted" | "rejected" | "partially_paid" | "requested_repay" | "completed";
}

interface OverviewData {
	metrics: MetricsData;
	actionRequired: ActionRequiredItem[];
	chartData: ChartData;
	recentTransactions: RecentTransaction[];
	upcomingDueDates: UpcomingDueDate[];
}

interface OverviewQueryParams {
	recentLimit?: number;
	upcomingLimit?: number;
	actionRequiredLimit?: number;
	monthsBack?: number;
}
