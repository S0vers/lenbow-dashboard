"use client";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/components/ui/table-skeleton";

import RequestsProvider from "@/templates/Desktop/Requests/Table/Provider/RequestsProvider";

const RequestsTable = dynamic(
	() => import("@/templates/Desktop/Requests/Table/RequestsTable"),
	{
		ssr: false,
		loading: () => <TableSkeleton />
	}
);

export default function RequestsTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h1 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
						Requests you made or received
					</h1>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						Manage and track all your requests in one place.
					</p>
				</div>
			</div>
			<Suspense fallback={<TableSkeleton />}>
				<RequestsProvider>
					<RequestsTable />
				</RequestsProvider>
			</Suspense>
		</div>
	);
}
