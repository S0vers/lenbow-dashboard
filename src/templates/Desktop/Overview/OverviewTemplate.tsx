"use client";

import { useState } from "react";

import ActionRequiredSection from "./ActionRequiredSection";
import BudgetSnapshotSection from "./BudgetSnapshotSection";
import EmptyState from "./EmptyState";
import MetricsCards from "./MetricsCards";
import QuickActions from "./QuickActions";
import RecentTransactionsSection from "./RecentTransactionsSection";
import UpcomingDueDatesSection from "./UpcomingDueDatesSection";
import { Link } from "@/i18n/navigation";
import { useGetOverviewQuery } from "@/redux/APISlices/OverviewAPISlice";
import { route } from "@/routes/routes";
import CreateBudgetTransactionModal from "@/templates/Desktop/Budget/Forms/CreateBudgetTransactionModal";

export default function OverviewTemplate() {
	const [createBudgetModalOpen, setCreateBudgetModalOpen] = useState(false);

	const { data, isLoading, isError, error } = useGetOverviewQuery({
		recentLimit: 5,
		upcomingLimit: 5,
		actionRequiredLimit: 5,
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
		<div className="container mx-auto px-4 py-6 sm:py-8 lg:px-8">
			<CreateBudgetTransactionModal
				open={createBudgetModalOpen}
				onOpenChange={setCreateBudgetModalOpen}
			/>

			{/* Hero: title + subtitle + quick actions */}
			<header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						Welcome back. Here&apos;s a quick snapshot.
					</p>
				</div>
				<QuickActions
					onAddTransaction={() => setCreateBudgetModalOpen(true)}
					className="flex shrink-0 flex-wrap gap-2"
				/>
			</header>

			<div className="space-y-12">
				{/* Key metrics: 4 cards only */}
				<section aria-label="Key metrics">
					<MetricsCards metrics={overviewData?.metrics!} isLoading={isLoading} />
				</section>

				{/* Budget this month: compact card only */}
				<section aria-label="Budget snapshot">
					<BudgetSnapshotSection
						budgetSummary={overviewData?.budgetSummary ?? null}
						recentBudgetTransactions={overviewData?.recentBudgetTransactions ?? []}
						isLoading={isLoading}
						compact
					/>
				</section>

				{/* Action required & Upcoming: side by side, limited items */}
				<section aria-label="Attention" className="grid gap-6 lg:grid-cols-2">
					<ActionRequiredSection
						actions={overviewData?.actionRequired || []}
						isLoading={isLoading}
						maxItems={3}
						onActionClick={action => {
							console.log("Action clicked:", action);
						}}
					/>
					<UpcomingDueDatesSection
						upcomingDueDates={overviewData?.upcomingDueDates || []}
						isLoading={isLoading}
						maxItems={3}
						onItemClick={item => {
							console.log("Due date item clicked:", item);
						}}
					/>
				</section>

				{/* Recent activity: 5 rows + View all */}
				<section aria-label="Recent activity">
					<RecentTransactionsSection
						transactions={overviewData?.recentTransactions || []}
						isLoading={isLoading}
						maxItems={5}
					/>
				</section>
			</div>
		</div>
	);
}

