"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

import { useGetBudgetTransactionsQuery } from "@/redux/APISlices/BudgetAPISlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CreateBudgetTransactionModal from "@/templates/Desktop/Budget/Forms/CreateBudgetTransactionModal";

export default function BudgetTemplate() {
	const [addModalOpen, setAddModalOpen] = useState(false);

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
					<h2 className="gradient-text text-xl font-semibold tracking-tight">Budget</h2>
					<p className="text-muted-foreground text-sm">
						Unable to load budget transactions. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden p-4">
			<CreateBudgetTransactionModal open={addModalOpen} onOpenChange={setAddModalOpen} />

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<h2 className="gradient-text text-xl font-semibold tracking-tight">Budget</h2>
					<p className="text-muted-foreground text-sm">
						Track your income and expenses.
					</p>
				</div>
				<Button
					onClick={() => setAddModalOpen(true)}
					className="min-h-[44px] shrink-0 rounded-full shadow-sm transition-all duration-300"
					size="sm"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add transaction
				</Button>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map(i => (
						<Skeleton key={i} className="h-20 w-full rounded-lg" />
					))}
				</div>
			) : transactions.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
					<p className="text-muted-foreground">No budget transactions yet.</p>
					<p className="text-muted-foreground text-sm">
						Add your first transaction to get started.
					</p>
					<Button
						onClick={() => setAddModalOpen(true)}
						className="min-h-[44px] rounded-full shadow-sm transition-all duration-300"
						size="sm"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add transaction
					</Button>
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
