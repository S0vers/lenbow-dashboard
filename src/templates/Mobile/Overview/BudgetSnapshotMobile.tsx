"use client";

import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface BudgetSnapshotMobileProps {
	budgetSummary: BudgetSummary | null;
	recentBudgetTransactions: RecentBudgetTransaction[];
	isLoading?: boolean;
	onAddTransaction?: () => void;
}

export default function BudgetSnapshotMobile({
	budgetSummary,
	recentBudgetTransactions,
	isLoading,
	onAddTransaction
}: BudgetSnapshotMobileProps) {
	if (isLoading) {
		return (
			<div className="space-y-3">
				<Skeleton className="h-6 w-24" />
				<div className="grid grid-cols-3 gap-2">
					{[1, 2, 3].map(i => (
						<Skeleton key={i} className="h-16 rounded-lg" />
					))}
				</div>
			</div>
		);
	}

	const hasBudget = budgetSummary != null || recentBudgetTransactions.length > 0;

	if (!hasBudget) {
		return (
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center gap-2 text-base">
						<Wallet className="h-4 w-4" />
						Budget
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap items-center gap-3">
					{onAddTransaction && (
						<Button
							type="button"
							onClick={onAddTransaction}
							size="pill"
							className="min-h-[44px] min-w-[140px] shadow-md [&_svg]:size-5"
						>
							<Plus className="mr-2" />
							Add transaction
						</Button>
					)}
					<Link
						href={route.private.budget}
						className="text-primary hover:underline text-sm font-medium"
					>
						Go to Budget →
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h3 className="font-semibold text-sm">Budget this month</h3>
				<div className="flex items-center gap-2">
					{onAddTransaction && (
						<Button
							type="button"
							onClick={onAddTransaction}
							size="pill"
							className="min-h-[44px] min-w-[140px] shadow-md [&_svg]:size-5"
						>
							<Plus className="mr-2" />
							Add transaction
						</Button>
					)}
					<Link href={route.private.budget} className="text-primary text-xs hover:underline">
						View all
					</Link>
				</div>
			</div>
			{budgetSummary != null && (
				<div className="grid grid-cols-3 gap-2">
					<Card>
						<CardContent className="flex items-center gap-2 p-3">
							<ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
							<div className="min-w-0">
								<p className="text-muted-foreground text-xs">Income</p>
								<p className="font-bold text-sm truncate">
									${budgetSummary.totalIncomeThisMonth.toFixed(0)}
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="flex items-center gap-2 p-3">
							<ArrowUpRight className="h-4 w-4 text-destructive shrink-0" />
							<div className="min-w-0">
								<p className="text-muted-foreground text-xs">Expenses</p>
								<p className="font-bold text-sm truncate">
									${budgetSummary.totalExpenseThisMonth.toFixed(0)}
								</p>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="flex items-center gap-2 p-3">
							<Wallet className="h-4 w-4 text-primary shrink-0" />
							<div className="min-w-0">
								<p className="text-muted-foreground text-xs">Balance</p>
								<p className="font-bold text-sm truncate">
									${budgetSummary.balanceThisMonth.toFixed(0)}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
			{recentBudgetTransactions.length > 0 && (
				<div className="space-y-2">
					<p className="text-muted-foreground text-xs font-medium">Recent budget</p>
					{recentBudgetTransactions.slice(0, 3).map(tx => (
						<Card key={tx.id}>
							<CardContent className="flex flex-row items-center justify-between p-3">
								<div className="min-w-0">
									<p className="font-medium text-sm truncate">{tx.name}</p>
									<p className="text-muted-foreground text-xs">
										{tx.categoryName ?? "Uncategorized"} ·{" "}
										{format(new Date(tx.date), "MMM d")}
									</p>
								</div>
								<div className="flex items-center gap-1.5 shrink-0">
									<Badge variant={tx.type === "in" ? "default" : "secondary"} className="text-xs">
										{tx.type}
									</Badge>
									<span className="font-medium text-sm">
										{tx.type === "in" ? "+" : "-"}
										{tx.currency?.symbol ?? "$"}
										{Number(tx.amount).toFixed(2)}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
