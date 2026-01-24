"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Loader from "@/components/ui/loader";

import HistoryCard from "./Components/HistoryCard";
import { MobileToolbar } from "./Components/MobileToolbar";
import { TransactionDetailsDrawer } from "./Components/TransactionDetailsDrawer";
import { useHistory } from "@/templates/Mobile/History/Hook/useHistory";

export default function HistoryList() {
	const { tableData, isLoading, loadMore, hasMore, isFetching } = useHistory();
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
					No transaction history found.
				</div>
			) : (
				<div className="grid gap-4">
					{tableData.map(transaction => (
						<HistoryCard key={transaction.id} data={transaction} />
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
