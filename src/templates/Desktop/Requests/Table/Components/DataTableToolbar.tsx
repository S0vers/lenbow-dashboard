"use client";

import { Table } from "@tanstack/react-table";
import { Plus, RefreshCw, X } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import DataTableDeleteSelected from "@/components/table/data-table-delete-selected";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableSearchInput } from "@/components/table/data-table-search-input";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";

import RequestsCreateModal from "@/templates/Desktop/Requests/Form/RequestsCreateModal";
import { TRANSACTION_TYPE } from "@/templates/Desktop/Requests/Table/Data/data";
import { useRequests } from "@/templates/Desktop/Requests/Table/Hook/useRequests";

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
		isDeleting,
		handleDeleteSelected,
		selectedIds,
		handleOptionFilter,
		searchParams,
		isRequestsCreateModalOpen,
		setIsRequestsCreateModalOpen,
		handleRefresh,
		isFetching
	} = useRequests();

	return (
		<>
			{/* Requests Create Modal */}
			<RequestsCreateModal
				isCreateModalOpen={isRequestsCreateModalOpen}
				setIsCreateModalOpen={setIsRequestsCreateModalOpen}
			/>
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
					{selectedGlobalValues && (
						<Button variant="ghost" onClick={handleResetAll} className="h-8 px-2 lg:px-3">
							Reset
							<X />
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<ExtendedButton
						variant="default"
						size="pill"
						className="ml-auto hidden h-10 rounded-full px-4 text-sm shadow-sm lg:inline-flex"
						onClick={() => setIsRequestsCreateModalOpen(true)}
					>
						<Plus className="size-4" aria-hidden="true" />
						Add Requests
					</ExtendedButton>
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
					{tableData.length > 0 && (
						<DataTableDeleteSelected
							selectedIds={selectedIds}
							isDeleting={isDeleting}
							handleDeleteSelected={handleDeleteSelected}
						/>
					)}
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</>
	);
}
