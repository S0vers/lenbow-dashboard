import { format } from "date-fns";
import { AlertCircle, AlertTriangle, ChevronRight, Clock, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface ActionRequiredMobileProps {
	actions: ActionRequiredItem[];
	isLoading?: boolean;
	onActionClick?: (action: ActionRequiredItem) => void;
}

const actionTypeConfig = {
	pending_request: {
		icon: Clock,
		label: "Pending",
		variant: "warning" as const
	},
	repayment_request: {
		icon: TrendingUp,
		label: "Repayment",
		variant: "default" as const
	},
	overdue_loan: {
		icon: AlertTriangle,
		label: "Overdue",
		variant: "destructive" as const
	},
	updated_transaction: {
		icon: AlertCircle,
		label: "Updated",
		variant: "default" as const
	}
};

function ActionItem({
	action,
	onActionClick
}: {
	action: ActionRequiredItem;
	onActionClick?: (action: ActionRequiredItem) => void;
}) {
	const config = actionTypeConfig[action.type];
	const Icon = config.icon;

	return (
		<Link href={`${route.private.requests}?search=${action.transactionId}`}>
			<div
				className={cn(
					"active:bg-muted/50 flex items-start gap-3 rounded-lg border p-3 transition-colors",
					action.type === "overdue_loan" && "border-destructive/50 bg-destructive/5"
				)}
				onClick={() => onActionClick?.(action)}
			>
				<div
					className={cn(
						"mt-0.5 shrink-0 rounded-full p-1.5",
						action.type === "overdue_loan"
							? "bg-destructive/10 text-destructive"
							: action.type === "pending_request"
								? "bg-amber-500/10 text-amber-600 dark:text-amber-500"
								: "bg-primary/10 text-primary"
					)}
				>
					<Icon className="h-3.5 w-3.5" />
				</div>

				<div className="min-w-0 flex-1 space-y-1.5">
					<div className="flex items-start justify-between gap-2">
						<div className="flex flex-wrap items-center gap-1.5">
							<Badge
								variant={config.variant === "warning" ? "secondary" : config.variant}
								className="text-xs"
							>
								{config.label}
							</Badge>
							<Badge variant="outline" className="text-xs">
								{action.userRole === "lender" ? "Lender" : "Borrower"}
							</Badge>
						</div>
						<ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
					</div>

					<div className="flex items-center gap-2">
						<Avatar className="h-7 w-7 shrink-0">
							<AvatarImage src={action.otherParty.image || ""} alt={action.otherParty.name || ""} />
							<AvatarFallback className="text-xs">
								{getUserInitials(action.otherParty.name || null)}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">
								{action.otherParty.name || action.otherParty.email}
							</p>
						</div>
						<div className="shrink-0 text-right">
							<p className="text-sm font-semibold">
								{action.currency.symbol}
								{action.amount.toFixed(0)}
							</p>
						</div>
					</div>

					{action.daysOverdue && action.daysOverdue > 0 && (
						<div className="text-destructive flex items-center gap-1.5">
							<AlertTriangle className="h-3 w-3" />
							<p className="text-xs font-medium">{action.daysOverdue} days overdue</p>
						</div>
					)}

					<p className="text-muted-foreground text-xs">
						{format(new Date(action.requestDate), "MMM dd, yyyy")}
					</p>
				</div>
			</div>
		</Link>
	);
}

function ActionItemSkeleton() {
	return (
		<div className="flex items-start gap-3 rounded-lg border p-3">
			<Skeleton className="mt-0.5 h-8 w-8 rounded-full" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-24" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-7 w-7 rounded-full" />
					<Skeleton className="h-4 flex-1" />
					<Skeleton className="h-4 w-12" />
				</div>
				<Skeleton className="h-3 w-32" />
			</div>
		</div>
	);
}

export default function ActionRequiredMobile({
	actions,
	isLoading,
	onActionClick
}: ActionRequiredMobileProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Action Required</CardTitle>
					<CardDescription className="text-xs">Items needing attention</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<ActionItemSkeleton key={i} />
					))}
				</CardContent>
			</Card>
		);
	}

	if (actions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Action Required</CardTitle>
					<CardDescription className="text-xs">Items needing attention</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<div className="bg-muted mb-3 rounded-full p-3">
							<Clock className="text-muted-foreground h-6 w-6" />
						</div>
						<p className="mb-1 text-sm font-medium">All caught up!</p>
						<p className="text-muted-foreground text-xs">No pending actions</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-base">Action Required</CardTitle>
						<CardDescription className="text-xs">Items needing attention</CardDescription>
					</div>
					<Badge variant="secondary" className="text-xs">
						{actions.length}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{actions.slice(0, 5).map(action => (
					<ActionItem key={action.transactionId} action={action} onActionClick={onActionClick} />
				))}
				{actions.length > 5 && (
					<p className="text-muted-foreground pt-2 text-center text-xs">
						+{actions.length - 5} more items
					</p>
				)}
			</CardContent>
		</Card>
	);
}
