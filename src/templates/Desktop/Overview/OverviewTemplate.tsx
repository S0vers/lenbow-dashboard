"use client";

import ActionRequiredSection from "./ActionRequiredSection";
import EmptyState from "./EmptyState";
import MetricsCards from "./MetricsCards";
import RecentTransactionsSection from "./RecentTransactionsSection";
import UpcomingDueDatesSection from "./UpcomingDueDatesSection";
import { Link } from "@/i18n/navigation";
import { useGetOverviewQuery } from "@/redux/APISlices/OverviewAPISlice";
import { route } from "@/routes/routes";

export default function OverviewTemplate() {
	const { data, isLoading, isError, error } = useGetOverviewQuery({
		recentLimit: 10,
		upcomingLimit: 10,
		actionRequiredLimit: 10,
		monthsBack: 6
	});

	const overviewData = data?.data;

	// Check if user has any data
	const hasData =
		overviewData &&
		(overviewData.metrics.totalBorrowed > 0 ||
			overviewData.metrics.totalLent > 0 ||
			overviewData.recentTransactions.length > 0 ||
			overviewData.actionRequired.length > 0);

	// Show error state
	if (isError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex min-h-100 flex-col items-center justify-center text-center">
					<h2 className="mb-2 text-2xl font-bold">Unable to Load Dashboard</h2>
					<p className="text-muted-foreground mb-4">
						{(error as any)?.data?.message || "Something went wrong. Please try again later."}
					</p>
					<Link href={route.private.dashboard} className="text-primary hover:underline">
						Refresh Page
					</Link>
				</div>
			</div>
		);
	}

	// Show empty state for new users
	if (!isLoading && !hasData) {
		return <EmptyState />;
	}

	return (
		<div className="container mx-auto space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground mt-1">
					Welcome back! Here&apos;s an overview of your loan activities.
				</p>
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
		</div>
	);
}
