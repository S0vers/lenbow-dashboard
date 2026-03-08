"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import BorrowList from "@/templates/Mobile/Borrow/List/BorrowList";
import BorrowProvider from "@/templates/Mobile/Borrow/Provider/BorrowProvider";

export default function BorrowTemplate() {
	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-4">
			<div className="flex flex-col gap-1">
				<h2 className="gradient-text text-xl font-semibold tracking-tight">Borrow</h2>
				<p className="text-muted-foreground text-sm">
					Manage and track all your borrow in one place.
				</p>
			</div>
			<Suspense fallback={<Loader />}>
				<BorrowProvider>
					<BorrowList />
				</BorrowProvider>
			</Suspense>
		</div>
	);
}
