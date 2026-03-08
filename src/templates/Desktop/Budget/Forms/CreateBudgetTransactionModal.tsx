"use client";

import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Add transaction</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Add a new income or expense to your budget.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<FieldLabel>Name</FieldLabel>
						<Input
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
						<Select
							value={form.watch("type")}
							onValueChange={v => form.setValue("type", v as "in" | "out")}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="in">In</SelectItem>
								<SelectItem value="out">Out</SelectItem>
							</SelectContent>
						</Select>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Category</FieldLabel>
						<Select
							value={form.watch("categoryId")}
							onValueChange={v => form.setValue("categoryId", v)}
						>
							<SelectTrigger>
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
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Date</FieldLabel>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!form.watch("date") && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{form.watch("date")
										? format(form.watch("date"), "PPP")
										: "Pick date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={form.watch("date")}
									onSelect={d => d && form.setValue("date", d)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Note (optional)</FieldLabel>
						<Input {...form.register("note")} placeholder="Short note" />
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Details (optional)</FieldLabel>
						<Textarea
							{...form.register("details")}
							placeholder="Longer description"
							rows={2}
						/>
					</FieldGroup>
					<ResponsiveDialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Adding…" : "Add transaction"}
						</Button>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
