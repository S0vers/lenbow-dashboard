"use client";

import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface BudgetSnapshotSectionProps {
	budgetSummary: BudgetSummary | null;
	recentBudgetTransactions: RecentBudgetTransaction[];
	isLoading?: boolean;
}

export default function BudgetSnapshotSection({
	budgetSummary,
	recentBudgetTransactions,
	isLoading
}: BudgetSnapshotSectionProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-48" />
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{[1, 2, 3].map(i => (
							<Skeleton key={i} className="h-20" />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	const hasBudget = budgetSummary != null || recentBudgetTransactions.length > 0;

	if (!hasBudget) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Budget
					</CardTitle>
					<CardDescription>
						Track your income and expenses. Add your first transaction to see a summary here.
					</CardDescription>
				</CardHeader>
				<CardContent>
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
		<div className="space-y-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Wallet className="h-5 w-5" />
							Budget this month
						</CardTitle>
						<CardDescription>
							Income, expenses and balance.{" "}
							<Link href={route.private.budget} className="text-primary hover:underline">
								View all →
							</Link>
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					{budgetSummary != null ? (
						<div className="grid gap-4 md:grid-cols-3">
							<div className="flex items-center gap-3 rounded-lg border p-4">
								<div className="rounded-lg bg-emerald-500/10 p-2">
									<ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
								</div>
								<div>
									<p className="text-muted-foreground text-xs font-medium">Income</p>
									<p className="text-xl font-bold">
										${budgetSummary.totalIncomeThisMonth.toFixed(2)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 rounded-lg border p-4">
								<div className="rounded-lg bg-destructive/10 p-2">
									<ArrowUpRight className="h-4 w-4 text-destructive" />
								</div>
								<div>
									<p className="text-muted-foreground text-xs font-medium">Expenses</p>
									<p className="text-xl font-bold">
										${budgetSummary.totalExpenseThisMonth.toFixed(2)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 rounded-lg border p-4">
								<div className="rounded-lg bg-primary/10 p-2">
									<Wallet className="h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="text-muted-foreground text-xs font-medium">Balance</p>
									<p className="text-xl font-bold">
										${budgetSummary.balanceThisMonth.toFixed(2)}
									</p>
								</div>
							</div>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">No budget data this month yet.</p>
					)}
				</CardContent>
			</Card>

			{recentBudgetTransactions.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Recent budget transactions</CardTitle>
						<CardDescription>
							<Link href={route.private.budget} className="text-primary hover:underline">
								View all in Budget →
							</Link>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentBudgetTransactions.slice(0, 5).map(tx => (
									<TableRow key={tx.id}>
										<TableCell className="font-medium">{tx.name}</TableCell>
										<TableCell>
											{tx.type === "in" ? "+" : "-"}
											{tx.currency?.symbol ?? "$"}
											{Number(tx.amount).toFixed(2)}
										</TableCell>
										<TableCell>
											<Badge variant={tx.type === "in" ? "default" : "secondary"}>
												{tx.type}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{tx.categoryName ?? "—"}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{format(new Date(tx.date), "MMM d, yyyy")}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
