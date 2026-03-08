"use client";

import { format } from "date-fns";

import { useGetBudgetTransactionsQuery } from "@/redux/APISlices/BudgetAPISlice";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function BudgetTemplate() {
	const { data, isLoading, isError } = useGetBudgetTransactionsQuery({
		limit: 50,
		sortBy: "date",
		sortOrder: "desc"
	});

	const transactions = data?.data ?? [];

	if (isError) {
		return (
			<div className="flex flex-col gap-4 p-4">
				<div>
					<h2 className="text-xl font-semibold tracking-tight">Budget</h2>
					<p className="text-muted-foreground text-sm">
						Unable to load budget transactions. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden p-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-xl font-semibold tracking-tight">Budget</h2>
				<p className="text-muted-foreground text-sm">
					Track your income and expenses.
				</p>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map(i => (
						<Skeleton key={i} className="h-20 w-full rounded-lg" />
					))}
				</div>
			) : transactions.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<p className="text-muted-foreground">No budget transactions yet.</p>
					<p className="text-muted-foreground text-sm mt-1">
						Add your first transaction to get started.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{transactions.map(tx => (
						<Card key={tx.id}>
							<CardContent className="flex flex-row items-center justify-between p-4">
								<div className="flex flex-col gap-0.5">
									<span className="font-medium">{tx.name}</span>
									<span className="text-muted-foreground text-sm">
										{tx.categoryName ?? "Uncategorized"} ·{" "}
										{format(new Date(tx.date), "MMM d, yyyy")}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant={tx.type === "in" ? "default" : "secondary"}>
										{tx.type}
									</Badge>
									<span className="font-medium">
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
