"use client";

import { Banknote, HandCoins } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";

import {
	transactionApiSlice,
	useUpdateTransactionStatusMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import BorrowPartialRepayModal from "@/templates/Mobile/Borrow/Form/BorrowPartialRepayModal";
import { useBorrow } from "@/templates/Mobile/Borrow/Hook/useBorrow";

interface BorrowMobileActionsProps {
	data: TransactionInterface;
	showFullButtons?: boolean;
}

export function BorrowMobileActions({ data, showFullButtons = false }: BorrowMobileActionsProps) {
	const dispatch = useAppDispatch();
	const { setActiveTransaction } = useBorrow();
	const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
	const [isCompleteRepayOpen, setIsCompleteRepayOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

	const handleCompleteRepayBorrow = () => {
		startTransition(async () => {
			await updateTransactionStatus({
				transactionId: data.id,
				body: { status: "requested_repay", reviewAmount: data.remainingAmount }
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsCompleteRepayOpen(false);
					setActiveTransaction(null);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsCompleteRepayOpen(false);
					toast.error(
						error?.data?.message || "Failed to complete repay borrow. Please try again later."
					);
				});
		});
	};

	const containerClass = showFullButtons ? "flex flex-col w-full gap-3" : "flex gap-2";
	const buttonClass = showFullButtons ? "w-full justify-center h-12 text-base" : "h-10 w-10";

	// Show action only if status allows (e.g. accepted/ongoing loans that can be repaid)
	// For now, mirroring usual borrow logic: if it's "accepted", user can repay.
	if (data.status === "accepted") {
		return (
			<>
				<BorrowPartialRepayModal
					transactionId={data.id}
					remainingAmount={data.remainingAmount || data.amount}
					isPartialRepayModalOpen={isRepayModalOpen}
					setIsPartialRepayModalOpen={setIsRepayModalOpen}
				/>

				<AlertDialog open={isCompleteRepayOpen} onOpenChange={setIsCompleteRepayOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure you want to full repay of this loan?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently complete the loan and remove it
								from the pending borrow list.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
							<ExtendedLoadingButton
								onClick={handleCompleteRepayBorrow}
								variant="success"
								isLoading={isPending}
								loadingText="Completing Payment..."
							>
								Yes, Complete Payment
							</ExtendedLoadingButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className={containerClass}>
					<ExtendedButton
						onClick={() => setIsRepayModalOpen(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="teal"
						className={buttonClass}
						disabled={isPending}
					>
						<HandCoins className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Partial Repay</span>}
					</ExtendedButton>

					<ExtendedButton
						onClick={() => setIsCompleteRepayOpen(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="success"
						className={buttonClass}
						disabled={isPending}
					>
						<Banknote className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Complete Repay</span>}
					</ExtendedButton>
				</div>
			</>
		);
	}

	return null;
}
