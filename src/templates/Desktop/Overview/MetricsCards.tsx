import { AlertTriangle, Clock, DollarSign } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardsProps {
	metrics: MetricsData;
	isLoading?: boolean;
}

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	description?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	variant?: "default" | "warning" | "danger" | "success";
}

function MetricCard({ title, value, icon, description, variant = "default" }: MetricCardProps) {
	const variantStyles = {
		default: "bg-primary/10 text-primary",
		warning: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
		danger: "bg-destructive/10 text-destructive",
		success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
	};

	return (
		<Card className="metric-card-hover group cursor-default overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
				<div
					className={cn(
						"rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110",
						variantStyles[variant]
					)}
				>
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold tracking-tight">{value}</div>
				{description && (
					<p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}

function MetricCardSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-10 w-10 rounded-lg" />
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-1 h-8 w-20" />
				<Skeleton className="h-3 w-32" />
			</CardContent>
		</Card>
	);
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
	if (isLoading) {
		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<MetricCardSkeleton key={i} />
				))}
			</div>
		);
	}

	const hasOverdue = metrics.overdueCount > 0;
	const hasPendingRequests = metrics.pendingRequests > 0;

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<MetricCard
				title="Total Borrowed"
				value={metrics.totalBorrowed.toFixed(2)}
				icon={<DollarSign className="h-4 w-4" />}
				description={
					metrics.overdueBorrowed > 0
						? `${metrics.overdueBorrowed} overdue`
						: "Active borrowed amount"
				}
				variant={metrics.overdueBorrowed > 0 ? "danger" : "default"}
			/>
			<MetricCard
				title="Total Lent"
				value={metrics.totalLent.toFixed(2)}
				icon={<DollarSign className="h-4 w-4" />}
				description={
					metrics.overdueLent > 0 ? `${metrics.overdueLent} overdue` : "Active lent amount"
				}
				variant={metrics.overdueLent > 0 ? "warning" : "success"}
			/>
			<MetricCard
				title="Pending Requests"
				value={metrics.pendingRequests}
				icon={<Clock className="h-4 w-4" />}
				description={hasPendingRequests ? "Awaiting your approval" : "All caught up"}
				variant={hasPendingRequests ? "warning" : "default"}
			/>
			<MetricCard
				title="Overdue"
				value={metrics.overdueCount}
				icon={<AlertTriangle className="h-4 w-4" />}
				description={hasOverdue ? "Needs attention" : "On track"}
				variant={hasOverdue ? "danger" : "success"}
			/>
		</div>
	);
}
