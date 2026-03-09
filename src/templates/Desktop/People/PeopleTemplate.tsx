"use client";

import { Suspense } from "react";

import dynamic from "next/dynamic";

import { TableSkeleton } from "@/components/ui/table-skeleton";

import PeopleProvider from "@/templates/Desktop/People/Table/Provider/PeopleProvider";

const PeopleTable = dynamic(
	() => import("@/templates/Desktop/People/Table/PeopleTable"),
	{
		ssr: false,
		loading: () => <TableSkeleton />
	}
);

export default function PeopleTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h1 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">
						Connected People
					</h1>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						Manage your connected people here.
					</p>
				</div>
			</div>
			<Suspense fallback={<TableSkeleton />}>
				<PeopleProvider>
					<PeopleTable />
				</PeopleProvider>
			</Suspense>
		</div>
	);
}
