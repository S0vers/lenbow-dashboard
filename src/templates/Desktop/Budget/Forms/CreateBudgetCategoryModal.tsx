"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { useCreateBudgetCategoryMutation } from "@/redux/APISlices/BudgetAPISlice";

interface CreateBudgetCategoryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface FormValues {
	name: string;
	slug: string;
}

export default function CreateBudgetCategoryModal({
	open,
	onOpenChange
}: CreateBudgetCategoryModalProps) {
	const [createCategory, { isLoading }] = useCreateBudgetCategoryMutation();

	const form = useForm<FormValues>({
		defaultValues: { name: "", slug: "" }
	});

	const onSubmit = async (values: FormValues) => {
		try {
			const res = await createCategory({
				name: values.name,
				slug: values.slug || values.name.toLowerCase().replace(/\s+/g, "-")
			}).unwrap();
			if (res?.data) {
				toast.success("Category created.");
				form.reset({ name: "", slug: "" });
				onOpenChange(false);
			} else {
				toast.error("Failed to create category.");
			}
		} catch {
			toast.error("Failed to create category.");
		}
	};

	return (
		<ResponsiveDialog open={open} onOpenChange={onOpenChange}>
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
				<ResponsiveDialogHeader className="shrink-0 space-y-1 px-6 pt-6">
					<ResponsiveDialogTitle>Add category</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Create a custom budget category. Leave slug empty to auto-generate from name.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<div className="-mx-6 max-h-[50vh] min-h-0 flex-1 overflow-y-auto px-6">
						<div className="space-y-4 pb-4">
					<FieldGroup>
						<FieldLabel>Name</FieldLabel>
						<Input
							{...form.register("name", { required: "Name is required" })}
							placeholder="e.g. Subscriptions"
						/>
						<FieldError>{form.formState.errors.name?.message}</FieldError>
					</FieldGroup>
					<FieldGroup>
						<FieldLabel>Slug (optional)</FieldLabel>
						<Input
							{...form.register("slug")}
							placeholder="e.g. subscriptions"
						/>
					</FieldGroup>
						</div>
					</div>
					<ResponsiveDialogFooter className="shrink-0 border-t border-border bg-muted/30 px-6 py-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Creating…" : "Create category"}
						</Button>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
