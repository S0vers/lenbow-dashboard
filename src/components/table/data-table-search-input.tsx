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
		<form onSubmit={onSubmit} className={cn("relative flex items-center", className)}>
			<div className="relative">
				<div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-2.5 peer-disabled:opacity-50">
					<Search className="size-4" />
					<span className="sr-only">Search</span>
				</div>
				<Input
					placeholder={placeholder}
					value={value}
					onChange={event => onChange(event.target.value)}
					type="text"
					className="peer h-8 w-[220px] rounded-lg px-2 py-1 text-sm pl-8 lg:w-[280px]"
				/>
			</div>
		</form>
	);
}

