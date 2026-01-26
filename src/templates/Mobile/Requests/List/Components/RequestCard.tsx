"use client";

import { CalendarDays, Clock } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { ExtendedBadge, type ExtendedVariant } from "@/components/custom-ui/extended-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { RequestMobileActions } from "./RequestMobileActions";
import useAuth from "@/hooks/use-auth";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";

interface RequestCardProps {
	data: TransactionInterface;
}

export default function RequestCard({ data }: RequestCardProps) {
	const { user } = useAuth();
	const { setActiveTransaction } = useRequests();

	const isUserBorrower = user && user.id === data.borrower.id;
	const image = isUserBorrower ? data.lender.image : data.borrower.image;
	const userName = isUserBorrower
		? data.lender.name || data.lender.email
		: data.borrower.name || data.borrower.email;

	const email = isUserBorrower ? data.lender.email : data.borrower.email;

	// Improved Badge Variants for nicer look
	const typeVariant: ExtendedVariant = data.type === "lend" ? "emerald" : "destructive";

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.2 }}
		>
			<Card className="border-border/60 bg-card/50 hover:border-border cursor-pointer shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
				<div onClick={() => setActiveTransaction(data)}>
					<CardHeader className="flex flex-row items-center gap-4 pb-3">
						<Avatar className="border-background h-12 w-12 border-2 shadow-sm">
							<AvatarImage src={image || undefined} alt={userName || "User"} />
							<AvatarFallback className="bg-primary/5 text-primary font-bold">
								{userName?.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col overflow-hidden">
							<h3 className="text-foreground truncate text-base font-semibold">
								{userName || "Unknown"}
							</h3>
							<p className="text-muted-foreground truncate text-xs font-medium">{email}</p>
						</div>
						<div className="ml-auto flex flex-col items-end gap-1">
							<span className="text-foreground text-lg font-bold tracking-tight">
								{data.currency.symbol}
								{data.amount.toLocaleString()}
							</span>
							<ExtendedBadge
								variant={typeVariant}
								className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
							>
								{data.type}
							</ExtendedBadge>
						</div>
					</CardHeader>

					<div className="px-6 pb-3">
						<div className="bg-border/50 h-px w-full" />
					</div>

					<CardContent className="grid gap-3 pb-3 text-sm">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
								<Clock className="h-3.5 w-3.5" />
								Request Date
							</span>
							<span className="font-medium">
								{new Date(data.requestDate || "").toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric"
								})}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
								<CalendarDays className="h-3.5 w-3.5" />
								Due Date
							</span>
							<span className={cn("font-medium", !data.dueDate && "text-muted-foreground italic")}>
								{data.dueDate
									? new Date(data.dueDate).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
											year: "numeric"
										})
									: "No due date"}
							</span>
						</div>
						<div className="mt-1 flex items-center justify-between">
							<span className="text-muted-foreground text-xs font-medium">Status</span>
							<ExtendedBadge variant={"destructive"} className="capitalize">
								{data.status}
							</ExtendedBadge>
						</div>
					</CardContent>
				</div>
				<CardFooter className="flex justify-end pt-2">
					<RequestMobileActions data={data} />
				</CardFooter>
			</Card>
		</motion.div>
	);
}
