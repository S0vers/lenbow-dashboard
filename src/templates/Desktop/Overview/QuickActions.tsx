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
		<div className={cn("flex flex-wrap gap-2", className)}>
			<Button
				onClick={onAddTransaction}
				className="rounded-full shadow-sm transition-all duration-300"
				size="sm"
			>
				<Plus className="mr-2 h-4 w-4" />
				Add transaction
			</Button>
			<Button
				asChild
				variant="outline"
				className="rounded-full shadow-sm transition-all duration-300"
				size="sm"
			>
				<Link href={route.private.requests}>
					<FileText className="mr-2 h-4 w-4" />
					New request
				</Link>
			</Button>
		</div>
	);
}
