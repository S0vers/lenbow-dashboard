"use client";

import { Plus, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
	onAddTransaction: () => void;
	className?: string;
}

export default function QuickActions({ onAddTransaction, className }: QuickActionsProps) {
	return (
		<div className={cn("flex flex-wrap items-center gap-3", className)}>
			<Button
				onClick={onAddTransaction}
				className="min-w-[140px] rounded-full shadow-md transition-all duration-300 hover:shadow-lg [&_svg]:size-5"
				size="pill"
			>
				<Plus className="mr-2" />
				Add transaction
			</Button>
			<Button
				asChild
				variant="outline"
				className="min-w-[120px] rounded-full shadow-sm transition-all duration-300 hover:shadow-md [&_svg]:size-5"
				size="pill"
			>
				<Link href={route.private.requests}>
					<FileText className="mr-2" />
					New request
				</Link>
			</Button>
		</div>
	);
}
