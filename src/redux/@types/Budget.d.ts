interface CurrencyData {
	code: string;
	name: string;
	symbol: string;
}

interface BudgetCategory {
	id: string;
	userId: number | null;
	name: string;
	slug: string;
	icon: string | null;
	createdAt: string;
	updatedAt: string;
}

interface BudgetTransaction {
	id: string;
	userId: number;
	name: string;
	amount: number;
	type: "in" | "out";
	currency: CurrencyData;
	categoryId: string | null;
	categoryName: string | null;
	date: string;
	note: string | null;
	details: string | null;
	receiptCount?: number;
	createdAt: string;
	updatedAt: string;
}

interface BudgetSubscription {
	id: string;
	userId: number;
	categoryId: string | null;
	categoryName: string | null;
	amount: number;
	currency: CurrencyData;
	name: string;
	recurrence: "weekly" | "monthly" | "yearly";
	nextRunAt: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface BudgetTransactionQueryParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	from?: string;
	to?: string;
	type?: "in" | "out";
	categoryId?: string;
}

interface CreateBudgetTransactionBody {
	name: string;
	amount: number;
	type: "in" | "out";
	currency?: CurrencyData;
	categoryId?: string | null;
	date: string;
	note?: string | null;
	details?: string | null;
}

interface UpdateBudgetTransactionBody {
	name?: string;
	amount?: number;
	type?: "in" | "out";
	currency?: CurrencyData;
	categoryId?: string | null;
	date?: string;
	note?: string | null;
	details?: string | null;
}

interface CreateBudgetCategoryBody {
	name: string;
	slug?: string;
	icon?: string | null;
}

interface UpdateBudgetCategoryBody {
	name?: string;
	slug?: string;
	icon?: string | null;
}

interface CreateBudgetSubscriptionBody {
	name: string;
	amount: number;
	currency?: CurrencyData;
	categoryId?: string | null;
	recurrence: "weekly" | "monthly" | "yearly";
	nextRunAt: string;
}

interface UpdateBudgetSubscriptionBody {
	name?: string;
	amount?: number;
	currency?: CurrencyData;
	categoryId?: string | null;
	recurrence?: "weekly" | "monthly" | "yearly";
	nextRunAt?: string;
	isActive?: boolean;
}
