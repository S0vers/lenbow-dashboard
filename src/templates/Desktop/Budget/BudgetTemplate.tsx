"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { useGetBudgetTransactionsQuery } from "@/redux/APISlices/BudgetAPISlice";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import CreateBudgetCategoryModal from "./Forms/CreateBudgetCategoryModal";
import CreateBudgetSubscriptionModal from "./Forms/CreateBudgetSubscriptionModal";
import CreateBudgetTransactionModal from "./Forms/CreateBudgetTransactionModal";

export default function BudgetTemplate() {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
	const [createSubscriptionOpen, setCreateSubscriptionOpen] = useState(false);
	const { data, isLoading, isError } = useGetBudgetTransactionsQuery({
		limit: 50,
		sortBy: "date",
		sortOrder: "desc"
	});

	const transactions = data?.data ?? [];

	if (isError) {
		return (
			<div className="container mx-auto space-y-6 p-4">
				<div>
					<h1 className="gradient-text text-3xl font-bold tracking-tight">Budget</h1>
					<p className="text-muted-foreground mt-1">
						Unable to load budget transactions. Please try again.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="gradient-text text-3xl font-bold tracking-tight">Budget</h1>
					<p className="text-muted-foreground mt-1">
						Track your income and expenses. Add transactions, manage categories and
						subscriptions.
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => setCreateCategoryOpen(true)}>
						Add category
					</Button>
					<Button variant="outline" onClick={() => setCreateSubscriptionOpen(true)}>
						Add subscription
					</Button>
					<Button onClick={() => setCreateModalOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add transaction
					</Button>
				</div>
			</div>
			<CreateBudgetTransactionModal
				open={createModalOpen}
				onOpenChange={setCreateModalOpen}
			/>
			<CreateBudgetCategoryModal
				open={createCategoryOpen}
				onOpenChange={setCreateCategoryOpen}
			/>
			<CreateBudgetSubscriptionModal
				open={createSubscriptionOpen}
				onOpenChange={setCreateSubscriptionOpen}
			/>

			<div className="rounded-lg border">
				{isLoading ? (
					<div className="p-4 space-y-3">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-64 w-full" />
					</div>
				) : transactions.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-muted-foreground">No budget transactions yet.</p>
						<p className="text-muted-foreground text-sm mt-1">
							Add your first transaction to get started.
						</p>
					</div>
				) : (
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
							{transactions.map(tx => (
								<TableRow key={tx.id}>
									<TableCell className="font-medium">{tx.name}</TableCell>
									<TableCell>
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
				)}
			</div>
		</div>
	);
}
