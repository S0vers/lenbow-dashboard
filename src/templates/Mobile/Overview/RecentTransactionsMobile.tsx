import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface RecentTransactionsMobileProps {
	transactions: RecentTransaction[];
	isLoading?: boolean;
	onTransactionClick?: (transaction: RecentTransaction) => void;
}

const statusConfig = {
	pending: {
		label: "Pending",
		className: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
	},
	accepted: {
		label: "Accepted",
		className: "bg-blue-500/10 text-blue-600 dark:text-blue-500"
	},
	partially_paid: {
		label: "Partial",
		className: "bg-purple-500/10 text-purple-600 dark:text-purple-500"
	},
	completed: {
		label: "Completed",
		className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
	},
	rejected: {
		label: "Rejected",
		className: "bg-destructive/10 text-destructive"
	},
	requested_repay: {
		label: "Repay",
		className: "bg-pink-500/10 text-pink-600 dark:text-pink-500"
	}
};

function TransactionItem({
	transaction,
	onTransactionClick
}: {
	transaction: RecentTransaction;
	onTransactionClick?: (transaction: RecentTransaction) => void;
}) {
	const config = statusConfig[transaction.status];

	const redirectLink = (type: "lend" | "borrow", status: TransactionStatusType, id: string) => {
		if (status === "pending") {
			return `${route.private.requests}?search=${id}`;
		} else if (status === "rejected" || status === "completed") {
			return `${route.private.history}?search=${id}`;
		} else {
			return `${type === "lend" ? route.private.lend : route.private.borrow}?search=${id}`;
		}
	};

	return (
		<Link href={redirectLink(transaction.type, transaction.status, transaction.id)}>
			<div
				className="active:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
				onClick={() => onTransactionClick?.(transaction)}
			>
				<Avatar className="h-10 w-10 shrink-0">
					<AvatarImage
						src={transaction.otherParty.image || ""}
						alt={transaction.otherParty.name || ""}
					/>
					<AvatarFallback className="text-xs">
						{getUserInitials(transaction.otherParty.name || null)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<div className="mb-0.5 flex items-center gap-2">
						<p className="truncate text-sm font-medium">
							{transaction.otherParty.name || transaction.otherParty.email}
						</p>
						{transaction.type === "borrow" ? (
							<ArrowDownLeft className="text-destructive h-3 w-3 shrink-0" />
						) : (
							<ArrowUpRight className="h-3 w-3 shrink-0 text-emerald-600" />
						)}
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="secondary" className={cn("text-xs", config.className)}>
							{config.label}
						</Badge>
						<p className="text-muted-foreground text-xs">
							{format(new Date(transaction.date), "MMM dd")}
						</p>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-2">
					<div className="text-right">
						<p className="text-sm font-semibold">
							{transaction.currency.symbol}
							{transaction.amount.toFixed(0)}
						</p>
					</div>
					<ChevronRight className="text-muted-foreground h-4 w-4" />
				</div>
			</div>
		</Link>
	);
}

function TransactionItemSkeleton() {
	return (
		<div className="flex items-center gap-3 rounded-lg border p-3">
			<Skeleton className="h-10 w-10 rounded-full" />
			<div className="flex-1">
				<Skeleton className="mb-2 h-4 w-32" />
				<Skeleton className="h-3 w-24" />
			</div>
			<Skeleton className="h-5 w-16" />
		</div>
	);
}

export default function RecentTransactionsMobile({
	transactions,
	isLoading,
	onTransactionClick
}: RecentTransactionsMobileProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Recent Transactions</CardTitle>
					<CardDescription className="text-xs">Latest activity</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<TransactionItemSkeleton key={i} />
					))}
				</CardContent>
			</Card>
		);
	}

	if (transactions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Recent Transactions</CardTitle>
					<CardDescription className="text-xs">Latest activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<p className="text-muted-foreground text-sm">No recent transactions</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Recent Transactions</CardTitle>
				<CardDescription className="text-xs">Latest activity</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{transactions.slice(0, 5).map(transaction => (
					<TransactionItem
						key={transaction.id}
						transaction={transaction}
						onTransactionClick={onTransactionClick}
					/>
				))}
				{transactions.length > 5 && (
					<p className="text-muted-foreground pt-2 text-center text-xs">
						+{transactions.length - 5} more transactions
					</p>
				)}
			</CardContent>
		</Card>
	);
}
