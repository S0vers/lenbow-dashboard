"use client";

import { Table } from "@tanstack/react-table";
import { RefreshCw, X } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableSearchInput } from "@/components/table/data-table-search-input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";

import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "@/templates/Desktop/History/Table/Data/data";
import { useHistory } from "@/templates/Desktop/History/Table/Hook/useHistory";

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
		handleOptionFilter,
		searchParams,
		handleRefresh,
		isFetching
	} = useHistory();

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
					<DataTableFacetedFilter
						title="Transaction Type"
						options={TRANSACTION_TYPE}
						queryParameter="type"
						handleOptionFilter={handleOptionFilter}
						searchParams={searchParams}
						selectedGlobalValues={selectedGlobalValues}
					/>
					<DataTableFacetedFilter
						title="Transaction Status"
						options={TRANSACTION_STATUS}
						queryParameter="status"
						handleOptionFilter={handleOptionFilter}
						searchParams={searchParams}
						selectedGlobalValues={selectedGlobalValues}
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
