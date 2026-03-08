import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import InputNumeric from "@/components/ui/input-numeric";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { useUpdateTransactionStatusMutation } from "@/redux/APISlices/TransactionAPISlice";
import {
	PartialRepayBorrowSchema,
	partialRepayBorrowSchema
} from "@/templates/Desktop/Borrow/Validation/Borrow.schema";

interface BorrowPartialRepayModalProps {
	transactionId: string;
	remainingAmount: number;
	isPartialRepayModalOpen: boolean;
	setIsPartialRepayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BorrowPartialRepayModal(props: BorrowPartialRepayModalProps) {
	const form = useForm({
		resolver: zodResolver(partialRepayBorrowSchema(props.remainingAmount)),
		defaultValues: {
			amount: ""
		}
	});

	const [updateTransactionStatus, { isLoading }] = useUpdateTransactionStatusMutation();

	const onSubmit = async (data: PartialRepayBorrowSchema) => {
		try {
			await updateTransactionStatus({
				transactionId: props.transactionId,
				body: {
					status: "requested_repay",
					reviewAmount: data.amount
				}
			})
				.then(response => {
					if (response.data) {
						form.reset();
						props.setIsPartialRepayModalOpen(false);
						toast.success("You have successfully partially repaid the loan request.");
					} else {
						toast.error("Failed to partially repay loan request. Please try again.");
					}
				})
				.catch(() => {
					toast.error("Failed to partially repay loan request. Please try again.");
				});
		} catch (error) {
			toast.error("Failed to partially repay loan request. Please try again.");
		}
	};

	return (
		<ResponsiveDialog
			open={props.isPartialRepayModalOpen}
			onOpenChange={props.setIsPartialRepayModalOpen}
		>
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
				<form
					id="partial-repay-request-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
				>
					<ResponsiveDialogHeader className="shrink-0 contents space-y-0 text-left">
						<ResponsiveDialogTitle className="border-b border-border px-6 py-4">
							Partial Repay the loan request
						</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<div className="-mx-6 max-h-[50vh] min-h-0 flex-1 overflow-y-auto px-6 py-4">
						<div>
							<FieldGroup>
								<Controller
									name="amount"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Amount</FieldLabel>
											<InputNumeric
												{...field}
												id={field.name}
												aria-invalid={fieldState.invalid}
												placeholder="Enter partial repayment amount"
												className="max-h-40"
												inputMode="numeric"
											/>
											{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
										</Field>
									)}
								/>
							</FieldGroup>
						</div>
					</div>
					<ResponsiveDialogFooter className="shrink-0 border-t border-border bg-muted/30 px-6 py-4 sm:justify-end">
						<ResponsiveDialogClose asChild>
							<Button type="button" variant="outline" disabled={isLoading}>
								<ChevronLeftIcon />
								Back
							</Button>
						</ResponsiveDialogClose>
						<ExtendedLoadingButton
							type="submit"
							form="partial-repay-request-form"
							isLoading={isLoading}
							loadingText="Repaying..."
							variant={"rose"}
						>
							Partial Repay
						</ExtendedLoadingButton>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
