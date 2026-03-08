"use client";

import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

import { cn } from "@/lib/utils";

import {
	useCreateBudgetSubscriptionMutation,
	useGetBudgetCategoriesQuery
} from "@/redux/APISlices/BudgetAPISlice";
import { format } from "date-fns";

interface CreateBudgetSubscriptionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface FormValues {
	name: string;
	amount: string;
	categoryId: string;
	recurrence: "weekly" | "monthly" | "yearly";
	nextRunAt: Date;
}

export default function CreateBudgetSubscriptionModal({
	open,
	onOpenChange
}: CreateBudgetSubscriptionModalProps) {
	const [createSubscription, { isLoading }] = useCreateBudgetSubscriptionMutation();
	const { data: categoriesData } = useGetBudgetCategoriesQuery(undefined, { skip: !open });

	const form = useForm<FormValues>({
		defaultValues: {
			name: "",
			amount: "",
			categoryId: "",
			recurrence: "monthly",
			nextRunAt: new Date()
		}
	});

	const onSubmit = async (values: FormValues) => {
		try {
			const res = await createSubscription({
				name: values.name,
				amount: Number(values.amount),
				categoryId: values.categoryId || undefined,
				recurrence: values.recurrence,
				nextRunAt: values.nextRunAt.toISOString()
			}).unwrap();
			if (res?.data) {
				toast.success("Subscription created.");
				form.reset({
					name: "",
					amount: "",
					categoryId: "",
					recurrence: "monthly",
					nextRunAt: new Date()
				});
				onOpenChange(false);
			} else {
				toast.error("Failed to create subscription.");
			}
		} catch {
			toast.error("Failed to create subscription.");
		}
	};

	const categories = categoriesData?.data ?? [];

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-md">
				<ResponsiveDialogHeader className="shrink-0">
					<ResponsiveDialogTitle>Add subscription</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Create a recurring expense. A new transaction will be added automatically each period.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<ScrollArea className="min-h-0 flex-1 pr-2">
						<div className="space-y-4">
					<FieldGroup>
						<FieldLabel>Name</FieldLabel>
						<Input
							{...form.register("name", { required: "Name is required" })}
							placeholder="e.g. Netflix"
						/>
						<FieldError>{form.formState.errors.name?.message}</FieldError>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Amount</FieldLabel>
						<Input
							type="number"
							step="0.01"
							min="0"
							{...form.register("amount", {
								required: "Amount is required",
								min: { value: 0.01, message: "Amount must be positive" }
							})}
							placeholder="0.00"
						/>
						<FieldError>{form.formState.errors.amount?.message}</FieldError>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Category</FieldLabel>
						<Controller
							name="categoryId"
							control={form.control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
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
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Recurrence</FieldLabel>
						<Controller
							name="recurrence"
							control={form.control}
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={v => field.onChange(v as "weekly" | "monthly" | "yearly")}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="weekly">Weekly</SelectItem>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="yearly">Yearly</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Next run date</FieldLabel>
						<Controller
							name="nextRunAt"
							control={form.control}
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-start text-left font-normal",
												!field.value && "text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
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
						</div>
					</ScrollArea>
					<ResponsiveDialogFooter className="shrink-0 border-t border-border bg-muted/30">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Creating…" : "Create subscription"}
						</Button>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
