"use client";

import { useState } from "react";

import ActionRequiredSection from "./ActionRequiredSection";
import BudgetSnapshotSection from "./BudgetSnapshotSection";
import EmptyState from "./EmptyState";
import MetricsCards from "./MetricsCards";
import QuickActions from "./QuickActions";
import RecentTransactionsSection from "./RecentTransactionsSection";
import UpcomingDueDatesSection from "./UpcomingDueDatesSection";
import CreateBudgetTransactionModal from "@/templates/Desktop/Budget/Forms/CreateBudgetTransactionModal";
import { Link } from "@/i18n/navigation";
import { useGetOverviewQuery } from "@/redux/APISlices/OverviewAPISlice";
import { route } from "@/routes/routes";

export default function OverviewTemplate() {
	const [createBudgetModalOpen, setCreateBudgetModalOpen] = useState(false);

	const { data, isLoading, isError, error } = useGetOverviewQuery({
		recentLimit: 10,
		upcomingLimit: 10,
		actionRequiredLimit: 10,
		monthsBack: 6
	});

	const overviewData = data?.data;

	// Check if user has any data (loan or budget)
	const hasData =
		overviewData &&
		(overviewData.metrics.totalBorrowed > 0 ||
			overviewData.metrics.totalLent > 0 ||
			overviewData.recentTransactions.length > 0 ||
			overviewData.actionRequired.length > 0 ||
			(overviewData.budgetSummary != null &&
				(overviewData.budgetSummary.totalIncomeThisMonth > 0 ||
					overviewData.budgetSummary.totalExpenseThisMonth > 0)) ||
			(overviewData.recentBudgetTransactions?.length ?? 0) > 0);

	// Show error state
	if (isError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex min-h-100 flex-col items-center justify-center text-center">
					<div className="bg-destructive/10 ring-destructive/20 mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
						<span className="text-destructive text-2xl font-bold">!</span>
					</div>
					<h2 className="mb-2 text-2xl font-bold">Unable to Load Dashboard</h2>
					<p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
						{(error as any)?.data?.message || "Something went wrong. Please try again later."}
					</p>
					<Link
						href={route.private.dashboard}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200"
					>
						Refresh Page
					</Link>
				</div>
			</div>
		);
	}

	// Show empty state for new users
	if (!isLoading && !hasData) {
		return (
			<>
				<CreateBudgetTransactionModal
					open={createBudgetModalOpen}
					onOpenChange={setCreateBudgetModalOpen}
				/>
				<EmptyState onAddTransaction={() => setCreateBudgetModalOpen(true)} />
			</>
		);
	}

	return (
		<div className="container mx-auto space-y-8">
			<CreateBudgetTransactionModal
				open={createBudgetModalOpen}
				onOpenChange={setCreateBudgetModalOpen}
			/>

			{/* Header + Quick actions */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="gradient-text text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Welcome back! Here&apos;s an overview of your loan activities.
					</p>
				</div>
				<QuickActions
					onAddTransaction={() => setCreateBudgetModalOpen(true)}
					className="flex shrink-0 flex-wrap gap-2"
				/>
			</div>

			{/* Metrics Cards */}
			<MetricsCards metrics={overviewData?.metrics!} isLoading={isLoading} />

			{/* Action Required & Upcoming Due Dates */}
			<div className="grid gap-6 lg:grid-cols-2">
				<ActionRequiredSection
					actions={overviewData?.actionRequired || []}
					isLoading={isLoading}
					onActionClick={action => {
						// Navigate to transaction detail or handle action
						console.log("Action clicked:", action);
					}}
				/>
				<UpcomingDueDatesSection
					upcomingDueDates={overviewData?.upcomingDueDates || []}
					isLoading={isLoading}
					onItemClick={item => {
						// Navigate to transaction detail
						console.log("Due date item clicked:", item);
					}}
				/>
			</div>

			{/* Charts Section */}
			{/* <ChartsSection chartData={overviewData?.chartData!} isLoading={isLoading} /> */}

			{/* Recent Transactions */}
			<RecentTransactionsSection
				transactions={overviewData?.recentTransactions || []}
				isLoading={isLoading}
			/>

			{/* Budget snapshot */}
			<BudgetSnapshotSection
				budgetSummary={overviewData?.budgetSummary ?? null}
				recentBudgetTransactions={overviewData?.recentBudgetTransactions ?? []}
				isLoading={isLoading}
				onAddTransaction={() => setCreateBudgetModalOpen(true)}
			/>
		</div>
	);
}
