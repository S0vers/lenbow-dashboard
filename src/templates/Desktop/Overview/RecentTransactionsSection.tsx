import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface RecentTransactionsSectionProps {
	transactions: RecentTransaction[];
	isLoading?: boolean;
}

const statusConfig = {
	pending: {
		label: "Pending",
		variant: "secondary" as const,
		className: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
	},
	accepted: {
		label: "Accepted",
		variant: "default" as const,
		className: "bg-blue-500/10 text-blue-600 dark:text-blue-500"
	},
	partially_paid: {
		label: "Partially Paid",
		variant: "secondary" as const,
		className: "bg-purple-500/10 text-purple-600 dark:text-purple-500"
	},
	completed: {
		label: "Completed",
		variant: "secondary" as const,
		className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
	},
	rejected: {
		label: "Rejected",
		variant: "destructive" as const,
		className: ""
	},
	requested_repay: {
		label: "Repayment Requested",
		variant: "secondary" as const,
		className: "bg-pink-500/10 text-pink-600 dark:text-pink-500"
	}
};

function TransactionRowSkeleton() {
	return (
		<TableRow>
			<TableCell>
				<div className="flex items-center gap-3">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div>
						<Skeleton className="mb-1 h-4 w-32" />
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
			</TableCell>
			<TableCell>
				<Skeleton className="h-5 w-16" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-6 w-24" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-5 w-20" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-4 w-24" />
			</TableCell>
			<TableCell>
				<Skeleton className="h-8 w-8 rounded" />
			</TableCell>
		</TableRow>
	);
}

export default function RecentTransactionsSection({
	transactions,
	isLoading
}: RecentTransactionsSectionProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
					<CardDescription>Your latest loan activities</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Contact</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Date</TableHead>
								<TableHead className="w-12.5"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...Array(5)].map((_, i) => (
								<TransactionRowSkeleton key={i} />
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		);
	}

	if (transactions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
					<CardDescription>Your latest loan activities</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<p className="text-muted-foreground text-sm">
							No recent transactions. Start lending or borrowing to see your activity here.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

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
		<Card>
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
				<CardDescription>Your latest loan activities</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Contact</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="w-12.5"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map(transaction => {
							const config = statusConfig[transaction.status];
							return (
								<TableRow key={transaction.id} className="hover:bg-muted/50">
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={transaction.otherParty.image || ""}
													alt={transaction.otherParty.name || ""}
												/>
												<AvatarFallback className="text-xs">
													{getUserInitials(transaction.otherParty.name || null)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium">
													{transaction.otherParty.name || transaction.otherParty.email}
												</p>
												{transaction.description && (
													<p className="text-muted-foreground line-clamp-1 text-xs">
														{transaction.description}
													</p>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											{transaction.type === "borrow" ? (
												<>
													<ArrowDownLeft className="text-destructive h-4 w-4" />
													<span className="text-sm font-medium">Borrow</span>
												</>
											) : (
												<>
													<ArrowUpRight className="h-4 w-4 text-emerald-600" />
													<span className="text-sm font-medium">Lend</span>
												</>
											)}
										</div>
									</TableCell>
									<TableCell>
										<div>
											<p className="text-sm font-semibold">
												{transaction.currency.symbol}
												{transaction.amount.toFixed(2)}
											</p>
											<p className="text-muted-foreground text-xs">{transaction.currency.code}</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={config.variant} className={cn(config.className)}>
											{config.label}
										</Badge>
									</TableCell>
									<TableCell>
										<div>
											<p className="text-sm">
												{format(new Date(transaction.date), "MMM dd, yyyy")}
											</p>
											{transaction.dueDate && (
												<p className="text-muted-foreground text-xs">
													Due: {format(new Date(transaction.dueDate), "MMM dd")}
												</p>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Link href={redirectLink(transaction.type, transaction.status, transaction.id)}>
											<ExternalLink className="text-muted-foreground hover:text-primary h-4 w-4 transition-colors" />
										</Link>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
