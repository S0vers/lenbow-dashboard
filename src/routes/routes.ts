export const route = {
	public: {},
	private: {
		dashboard: "/",
		budget: "/budget",
		profile: "/profile",
		settings: "/settings",
		templates: "/templates",
		templatesList: "/templates/list",
		templatesNew: "/templates/new",
		requests: "/requests",
		borrow: "/borrow",
		lend: "/lend",
		repay: "/repay",
		history: "/history",
		people: "/people",
		notifications: "/notifications",
		support: "/support"
	},
	protected: {
		login: "/login"
	}
};

export const apiRoute = {
	csrf: "/csrf",
	login: "/auth/login",
	googleLogin: "/auth/google",
	me: "/auth/me",
	logout: "/auth/logout",
	updateProfile: "/auth/profile",
	updateProfileImage: "/auth/profile/image",
	updateEmailPreferences: "/auth/email-preferences",
	unsubscribe: (token: string) => `/auth/unsubscribe/${token}`,
	changePassword: "/auth/change-password",
	toggle2FA: "/auth/2fa",
	deleteAccount: "/auth/account",
	mfa: {
		status: "/mfa/status",
		setup: "/mfa/setup",
		setupVerify: "/mfa/setup/verify",
		verify: "/mfa/verify",
		disable: "/mfa/disable",
		backupCodes: "/mfa/backup-codes"
	},
	currency: "/currency",
	transactions: "/transactions",
	transaction: (transactionId: string) => `/transactions/${transactionId}`,
	requestedTransactions: "/transactions/requested",
	updateTransactionRequest: (transactionId: string) => `/transactions/${transactionId}/update`,
	updateTransactionStatus: (transactionId: string) => `/transactions/${transactionId}/status`,
	acceptRequestRepaymentTransaction: (transactionId: string) =>
		`/transactions/${transactionId}/repayment/accept`,
	rejectRequestRepaymentTransaction: (transactionId: string) =>
		`/transactions/${transactionId}/repayment/reject`,
	contacts: "/contacts",
	contact: (userId: string) => `/contacts/${userId}`,
	connectedContacts: "/contacts/connected",
	overview: "/overview",
	transactionHistory: "/history/transactions",
	emailTemplates: "/email-templates",
	emailTemplate: (id: string) => `/email-templates/${id}`,
	emailTemplateTestSend: (id: string) => `/email-templates/${id}/test-send`,
	budgetCategories: "/budget-categories",
	budgetTransactions: "/budget-transactions",
	budgetTransaction: (id: string) => `/budget-transactions/${id}`,
	budgetTransactionReceipts: (id: string) => `/budget-transactions/${id}/receipts`,
	budgetSubscriptions: "/budget-subscriptions",
	budgetSubscription: (id: string) => `/budget-subscriptions/${id}`
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;

export { DEFAULT_LOGIN_REDIRECT, appRoutePrefix };
