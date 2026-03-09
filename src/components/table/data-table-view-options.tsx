"use client";

import type { Header, Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { SmoothDropdown } from "@/components/custom-ui/SmoothDropdown";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	const columns = table
		.getAllColumns()
		.filter(column => typeof column.accessorFn !== "undefined" && column.getCanHide());

	return (
		<SmoothDropdown triggerIcon={Settings2} triggerLabel="View">
			<div className="space-y-1 text-sm">
				<p className="text-muted-foreground mb-1 px-1 text-xs font-semibold">
					Toggle columns
				</p>
				{columns.map(column => {
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
						<label
							key={column.id}
							className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5"
						>
							<input
								type="checkbox"
								checked={column.getIsVisible()}
								onChange={event => column.toggleVisibility(event.target.checked)}
								className="border-border h-3.5 w-3.5 rounded-sm"
							/>
							<span className="capitalize">{title}</span>
						</label>
					);
				})}
			</div>
		</SmoothDropdown>
	);
}

