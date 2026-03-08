"use client";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/components/ui/table-skeleton";

import LendProvider from "@/templates/Desktop/Lend/Table/Provider/LendProvider";

const LendTable = dynamic(() => import("@/templates/Desktop/Lend/Table/LendTable"), {
	ssr: false,
	loading: () => <TableSkeleton />
});

export default function LendTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="gradient-text text-2xl font-semibold tracking-tight">The transactions you have lent</h2>
					<p className="text-muted-foreground">Manage and track all your lend in one place.</p>
				</div>
			</div>
			<Suspense fallback={<TableSkeleton />}>
				<LendProvider>
					<LendTable />
				</LendProvider>
			</Suspense>
		</div>
	);
}
