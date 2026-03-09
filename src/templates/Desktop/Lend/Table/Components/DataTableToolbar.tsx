"use client";

import { Table } from "@tanstack/react-table";
import { RefreshCw, X } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { DataTableSearchInput } from "@/components/table/data-table-search-input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";

import { useLend } from "@/templates/Desktop/Lend/Table/Hook/useLend";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const {
		search,
		tableData,
		setSearch,
		handleSearch,
		selectedGlobalValues,
		handleResetAll,
		selectedIds,
		handleRefresh,
		isFetching
	} = useLend();

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center space-x-2">
					<DataTableSearchInput
						placeholder="Type 3 letters to search..."
						value={search}
						onChange={setSearch}
						onSubmit={handleSearch}
					/>
					{selectedGlobalValues && (
						<Button variant="ghost" onClick={handleResetAll} className="h-8 px-2 lg:px-3">
							Reset
							<X />
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<ExtendedButton
						variant="orange"
						size="pill"
						className="ml-auto hidden h-10 rounded-full px-4 text-sm shadow-sm lg:inline-flex"
						onClick={() => handleRefresh()}
						disabled={isFetching}
					>
						<RefreshCw
							className={`size-4 ${isFetching ? "animate-spin" : ""}`}
							aria-hidden="true"
						/>
						Refresh
					</ExtendedButton>
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</>
	);
}
