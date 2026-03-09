"use client";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/components/ui/table-skeleton";

import BorrowProvider from "@/templates/Desktop/Borrow/Table/Provider/BorrowProvider";

const BorrowTable = dynamic(
	() => import("@/templates/Desktop/Borrow/Table/BorrowTable"),
	{
		ssr: false,
		loading: () => <TableSkeleton />
	}
);

export default function BorrowTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h1 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
						The transactions you have borrowed
					</h1>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						Manage and track all your borrow in one place.
					</p>
				</div>
			</div>
			<Suspense fallback={<TableSkeleton />}>
				<BorrowProvider>
					<BorrowTable />
				</BorrowProvider>
			</Suspense>
		</div>
	);
}
