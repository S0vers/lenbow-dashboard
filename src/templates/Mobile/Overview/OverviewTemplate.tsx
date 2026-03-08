"use client";

import { useState } from "react";

import ActionRequiredMobile from "./ActionRequiredMobile";
import BudgetSnapshotMobile from "./BudgetSnapshotMobile";
import EmptyStateMobile from "./EmptyStateMobile";
import MetricsCardsMobile from "./MetricsCardsMobile";
import RecentTransactionsMobile from "./RecentTransactionsMobile";
import UpcomingDueDatesMobile from "./UpcomingDueDatesMobile";
import QuickActions from "@/templates/Desktop/Overview/QuickActions";
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

	return (
		<>
			{/* Content */}
			{isError ? (
				<div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
					<h2 className="mb-2 text-lg font-bold">Unable to Load Dashboard</h2>
					<p className="text-muted-foreground mb-4 text-sm">
						{(error as any)?.data?.message || "Something went wrong. Please try again later."}
					</p>
					<Link href={route.private.dashboard} className="text-primary text-sm hover:underline">
						Refresh Page
					</Link>
				</div>
			) : !isLoading && !hasData ? (
				<>
					<CreateBudgetTransactionModal
						open={createBudgetModalOpen}
						onOpenChange={setCreateBudgetModalOpen}
					/>
					<EmptyStateMobile onAddTransaction={() => setCreateBudgetModalOpen(true)} />
				</>
			) : (
				<div className="flex-1 space-y-4 px-4 py-6">
					<CreateBudgetTransactionModal
						open={createBudgetModalOpen}
						onOpenChange={setCreateBudgetModalOpen}
					/>

					{/* Quick actions - touch-friendly */}
					<QuickActions
						onAddTransaction={() => setCreateBudgetModalOpen(true)}
						className="gap-2 pb-1"
					/>

					{/* Metrics */}
					<MetricsCardsMobile metrics={overviewData?.metrics!} isLoading={isLoading} />

					{/* Action Required */}
					<ActionRequiredMobile
						actions={overviewData?.actionRequired || []}
						isLoading={isLoading}
						onActionClick={action => {
							console.log("Action clicked:", action);
						}}
					/>

					{/* Upcoming Due Dates */}
					<UpcomingDueDatesMobile
						upcomingDueDates={overviewData?.upcomingDueDates || []}
						isLoading={isLoading}
						onItemClick={item => {
							console.log("Due date clicked:", item);
						}}
					/>

					{/* Charts */}
					{/* <ChartsMobile chartData={overviewData?.chartData!} isLoading={isLoading} /> */}

					{/* Recent Transactions */}
					<RecentTransactionsMobile
						transactions={overviewData?.recentTransactions || []}
						isLoading={isLoading}
						onTransactionClick={transaction => {
							console.log("Transaction clicked:", transaction);
						}}
					/>

					{/* Budget snapshot */}
					<BudgetSnapshotMobile
						budgetSummary={overviewData?.budgetSummary ?? null}
						recentBudgetTransactions={overviewData?.recentBudgetTransactions ?? []}
						isLoading={isLoading}
						onAddTransaction={() => setCreateBudgetModalOpen(true)}
					/>
				</div>
			)}
		</>
	);
}
