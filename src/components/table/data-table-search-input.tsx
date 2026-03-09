"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

type DataTableSearchInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	placeholder?: string;
	className?: string;
};

export function DataTableSearchInput({
	value,
	onChange,
	onSubmit,
	placeholder = "Search…",
	className
}: DataTableSearchInputProps) {
	return (
		<form onSubmit={onSubmit} className={cn("flex items-center", className)}>
			<div className="flex h-10 w-[260px] items-center gap-2 rounded-full bg-muted/70 px-3 lg:w-[320px]">
				<Search className="size-4 text-muted-foreground" />
				<Input
					placeholder={placeholder}
					value={value}
					onChange={event => onChange(event.target.value)}
					type="text"
					className="h-8 w-full border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
				/>
			</div>
		</form>
	);
}

