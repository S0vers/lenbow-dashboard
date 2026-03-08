"use client";

import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputNumeric from "@/components/ui/input-numeric";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

import {
	useCreateBudgetTransactionMutation,
	useGetBudgetCategoriesQuery
} from "@/redux/APISlices/BudgetAPISlice";
import { format } from "date-fns";

interface CreateBudgetTransactionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface FormValues {
	name: string;
	amount: string;
	type: "in" | "out";
	categoryId: string;
	date: Date;
	note: string;
	details: string;
}

export default function CreateBudgetTransactionModal({
	open,
	onOpenChange
}: CreateBudgetTransactionModalProps) {
	const [createTransaction, { isLoading }] = useCreateBudgetTransactionMutation();
	const { data: categoriesData } = useGetBudgetCategoriesQuery(undefined, { skip: !open });

	const form = useForm<FormValues>({
		defaultValues: {
			name: "",
			amount: "",
			type: "out",
			categoryId: "",
			date: new Date(),
			note: "",
			details: ""
		}
	});

	const onSubmit = async (values: FormValues) => {
		try {
			const res = await createTransaction({
				name: values.name,
				amount: Number(values.amount),
				type: values.type,
				categoryId: values.categoryId || undefined,
				date: values.date.toISOString(),
				note: values.note || undefined,
				details: values.details || undefined
			}).unwrap();
			if (res?.data) {
				toast.success("Transaction added.");
				form.reset({
					name: "",
					amount: "",
					type: "out",
					categoryId: "",
					date: new Date(),
					note: "",
					details: ""
				});
				onOpenChange(false);
			} else {
				toast.error("Failed to add transaction.");
			}
		} catch {
			toast.error("Failed to add transaction.");
		}
	};

	const categories = categoriesData?.data ?? [];

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-md">
				<ResponsiveDialogHeader className="shrink-0 gap-1">
					<ResponsiveDialogTitle className="gradient-text text-lg font-semibold tracking-tight md:text-xl">
						Add transaction
					</ResponsiveDialogTitle>
					<ResponsiveDialogDescription className="text-base">
						Add a new income or expense to your budget.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
				>
					<ScrollArea className="min-h-0 flex-1 pr-2">
						<div className="space-y-5">
					<FieldGroup>
						<FieldLabel>Name</FieldLabel>
						<Input
							className="h-11"
							{...form.register("name", { required: "Name is required" })}
							placeholder="e.g. Groceries"
						/>
						<FieldError>{form.formState.errors.name?.message}</FieldError>
					</FieldGroup>
					<FieldGroup>
						<Controller
							name="amount"
							control={form.control}
							rules={{
								required: "Amount is required",
								validate: (v) => {
									const n = Number(v);
									if (Number.isNaN(n)) return "Amount must be a number";
									if (n < 0.01) return "Amount must be positive";
									return true;
								}
							}}
							render={({ field, fieldState }) => (
								<>
									<FieldLabel htmlFor="amount">Amount</FieldLabel>
									<InputNumeric
										{...field}
										className="h-11"
										id="amount"
										aria-invalid={fieldState.invalid}
										placeholder="0.00"
										numberType="decimal"
										numberSign="positive"
										inputMode="numeric"
									/>
									<FieldError>{fieldState.error?.message}</FieldError>
								</>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Type</FieldLabel>
						<Controller
							name="type"
							control={form.control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={v => field.onChange(v as "in" | "out")}>
									<SelectTrigger size="lg">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="in">In</SelectItem>
										<SelectItem value="out">Out</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Category</FieldLabel>
						<Controller
							name="categoryId"
							control={form.control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger size="lg">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map(cat => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Date</FieldLabel>
						<Controller
							name="date"
							control={form.control}
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"h-11 w-full justify-start text-left font-normal shadow-sm",
												!field.value && "text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 size-4" />
											{field.value ? format(field.value, "PPP") : "Pick date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={d => d && field.onChange(d)}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Note (optional)</FieldLabel>
						<Input className="h-11" {...form.register("note")} placeholder="Short note" />
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Details (optional)</FieldLabel>
						<Textarea
							{...form.register("details")}
							placeholder="Longer description"
							rows={2}
						/>
					</FieldGroup>
						</div>
					</ScrollArea>
					<ResponsiveDialogFooter className="shrink-0 gap-3 sm:gap-3">
						<Button
							type="button"
							variant="outline"
							size="pill"
							className="min-w-[100px]"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="pill"
							className="min-w-[160px] shadow-md"
							disabled={isLoading}
						>
							{isLoading ? "Adding…" : "Add transaction"}
						</Button>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
