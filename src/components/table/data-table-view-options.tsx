"use client";

import type { Header, Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="pill"
					className="ml-auto hidden h-10 rounded-full px-4 text-sm shadow-sm lg:inline-flex"
				>
					<Settings2 />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-37.5">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter(column => typeof column.accessorFn !== "undefined" && column.getCanHide())
					.map(column => {
						const headerContent = column.columnDef.header;

						let title = column.id;
						if (headerContent && typeof headerContent === "function") {
							const renderedHeader = headerContent({
								column,
								header: column.columnDef.header as unknown as Header<TData, unknown>,
								table
							});
							if (renderedHeader?.props?.title) {
								title = renderedHeader.props.title;
							}
						}

						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={value => column.toggleVisibility(!!value)}
							>
								{title}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
