"use client";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/components/ui/table-skeleton";

import HistoryProvider from "@/templates/Desktop/History/Table/Provider/HistoryProvider";

const HistoryTable = dynamic(
	() => import("@/templates/Desktop/History/Table/HistoryTable"),
	{
		ssr: false,
		loading: () => <TableSkeleton />
	}
);

export default function HistoryTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h1 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
						Transaction History
					</h1>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						Review your past transactions and monitor your account activity.
					</p>
				</div>
			</div>
			<Suspense fallback={<TableSkeleton />}>
				<HistoryProvider>
					<HistoryTable />
				</HistoryProvider>
			</Suspense>
		</div>
	);
}
