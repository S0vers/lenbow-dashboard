import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
	handleSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	sortBy,
	sortOrder,
	handleSorting,
	className
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	const handleApplySorting = (sortOrder: "asc" | "desc") => {
		handleSorting(column.id, sortOrder);
	};

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
						<span>{title}</span>
						{sortBy === column.id && sortOrder === "desc" ? (
							<ArrowDown />
						) : sortBy === column.id && sortOrder === "asc" ? (
							<ArrowUp />
						) : (
							<ChevronsUpDown />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => handleApplySorting("asc")}>
						<ArrowUp className="text-muted-foreground/70 h-3.5 w-3.5" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleApplySorting("desc")}>
						<ArrowDown className="text-muted-foreground/70 h-3.5 w-3.5" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<EyeOff className="text-muted-foreground/70 h-3.5 w-3.5" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
