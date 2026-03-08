import { format } from "date-fns";
import { AlertTriangle, Calendar, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface UpcomingDueDatesSectionProps {
	upcomingDueDates: UpcomingDueDate[];
	isLoading?: boolean;
	onItemClick?: (item: UpcomingDueDate) => void;
	/** Max items to show (e.g. 3 on overview). Omit to show all. */
	maxItems?: number;
}

const urgencyConfig = {
	high: {
		label: "High",
		variant: "destructive" as const,
		icon: AlertTriangle,
		className: "bg-destructive/10 text-destructive"
	},
	medium: {
		label: "Medium",
		variant: "secondary" as const,
		icon: Clock,
		className: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
	},
	low: {
		label: "Low",
		variant: "secondary" as const,
		icon: Calendar,
		className: "bg-blue-500/10 text-blue-600 dark:text-blue-500"
	}
};

function DueDateItem({
	item,
	onItemClick
}: {
	item: UpcomingDueDate;
	onItemClick?: (item: UpcomingDueDate) => void;
}) {
	const config = urgencyConfig[item.urgency];
	const Icon = config.icon;

	return (
		<div
			className={cn(
				"hover:bg-muted/50 flex cursor-pointer items-start gap-4 rounded-xl border border-border p-4 shadow-sm transition-all duration-200 hover:shadow-md",
				item.urgency === "high" && "border-destructive/50 bg-destructive/5"
			)}
			onClick={() => onItemClick?.(item)}
		>
			<div className={cn("mt-1 rounded-full p-2", config.className)}>
				<Icon className="h-4 w-4" />
			</div>

			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="mb-1 flex items-center gap-2">
							<Badge variant={config.variant}>{config.label} Priority</Badge>
							<Badge variant="outline" className="text-xs">
								{item.type === "borrow" ? "You Owe" : "They Owe"}
							</Badge>
						</div>
						<p className="text-muted-foreground text-xs">
							{item.daysUntilDue === 0
								? "Due today"
								: item.daysUntilDue === 1
									? "Due tomorrow"
									: `Due in ${item.daysUntilDue} days`}
						</p>
					</div>
					<div className="text-right">
						<p className="text-lg font-semibold">
							{item.currency.symbol}
							{item.remainingAmount.toFixed(2)}
						</p>
						<p className="text-muted-foreground text-xs">
							of {item.currency.symbol}
							{item.amount.toFixed(2)}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={item.otherParty.image || ""} alt={item.otherParty.name || ""} />
						<AvatarFallback className="text-xs">
							{getUserInitials(item.otherParty.name || null)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<p className="text-sm font-medium">{item.otherParty.name || item.otherParty.email}</p>
						{item.otherParty.name && (
							<p className="text-muted-foreground text-xs">{item.otherParty.email}</p>
						)}
					</div>
				</div>

				<div className="text-muted-foreground flex items-center gap-2">
					<Calendar className="h-3 w-3" />
					<p className="text-xs">Due: {format(new Date(item.dueDate), "MMM dd, yyyy")}</p>
				</div>
			</div>
		</div>
	);
}

function DueDateItemSkeleton() {
	return (
		<div className="flex items-start gap-4 rounded-lg border p-4">
			<Skeleton className="mt-1 h-10 w-10 rounded-full" />
			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-6 w-20" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-full" />
					<div className="flex-1">
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
				<Skeleton className="h-3 w-40" />
			</div>
		</div>
	);
}

export default function UpcomingDueDatesSection({
	upcomingDueDates,
	isLoading,
	onItemClick,
	maxItems
}: UpcomingDueDatesSectionProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Due Dates</CardTitle>
					<CardDescription>Loans due in the next 30 days</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<DueDateItemSkeleton key={i} />
					))}
				</CardContent>
			</Card>
		);
	}

	if (upcomingDueDates.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Due Dates</CardTitle>
					<CardDescription>Loans due in the next 30 days</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<div className="bg-muted/80 mb-4 rounded-full p-5">
							<Calendar className="text-muted-foreground h-10 w-10" />
						</div>
						<h3 className="mb-2 text-xl font-semibold">No upcoming due dates</h3>
						<p className="text-muted-foreground max-w-sm text-base">
							You don&apos;t have any loans due in the next 30 days.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Sort by urgency (high -> medium -> low) and days until due
	const sortedDueDates = [...upcomingDueDates].sort((a, b) => {
		const urgencyOrder = { high: 0, medium: 1, low: 2 };
		if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
			return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
		}
		return a.daysUntilDue - b.daysUntilDue;
	});

	const displayDueDates = maxItems != null ? sortedDueDates.slice(0, maxItems) : sortedDueDates;
	const hasMore = maxItems != null && sortedDueDates.length > maxItems;

	const highPriority = sortedDueDates.filter(item => item.urgency === "high").length;
	const mediumPriority = sortedDueDates.filter(item => item.urgency === "medium").length;

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div>
						<CardTitle>Upcoming Due Dates</CardTitle>
						<CardDescription>Loans due in the next 30 days</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						{hasMore && (
							<Link
								href={route.private.requests}
								className="text-primary text-sm font-medium hover:underline"
							>
								View all →
							</Link>
						)}
						{highPriority > 0 && (
							<Badge variant="destructive" className="text-xs">
								{highPriority} High
							</Badge>
						)}
						{mediumPriority > 0 && (
							<Badge
								variant="secondary"
								className="bg-amber-500/10 text-xs text-amber-600 dark:text-amber-500"
							>
								{mediumPriority} Medium
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ScrollArea className={maxItems != null ? "max-h-[320px] pr-4" : "h-125 pr-4"}>
					<div className="space-y-3">
						{displayDueDates.map(item => (
							<DueDateItem key={item.id} item={item} onItemClick={onItemClick} />
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
