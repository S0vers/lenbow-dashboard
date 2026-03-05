"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import dynamic from "next/dynamic";

import Loader from "@/components/ui/loader";

import { useBorrow } from "@/templates/Mobile/Borrow/Hook/useBorrow";
import BorrowCard from "@/templates/Mobile/Borrow/List/Components/BorrowCard";
import { MobileToolbar } from "@/templates/Mobile/Borrow/List/Components/MobileToolbar";

const TransactionDetailsDrawer = dynamic(
	() =>
		import("@/templates/Mobile/Borrow/List/Components/TransactionDetailsDrawer").then(
			module => ({
				default: module.TransactionDetailsDrawer
			})
		),
	{
		ssr: false
	}
);

export default function BorrowList() {
	const { tableData, isLoading, loadMore, hasMore, isFetching } = useBorrow();
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			loadMore();
		}
	}, [inView, loadMore]);

	if (isLoading && tableData.length === 0) {
		return <Loader />;
	}

	return (
		<div className="flex flex-col gap-4">
			<MobileToolbar />

			{tableData.length === 0 ? (
				<div className="text-muted-foreground flex h-40 items-center justify-center rounded-md border border-dashed">
					No borrowed transactions found.
				</div>
			) : (
				<div className="grid gap-4">
					{tableData.map(transaction => (
						<BorrowCard key={transaction.id} data={transaction} />
					))}
					{hasMore && (
						<div ref={ref} className="flex justify-center p-4">
							{isFetching && <Loader2 className="text-primary animate-spin" />}
						</div>
					)}
				</div>
			)}
			<TransactionDetailsDrawer />
		</div>
	);
}
