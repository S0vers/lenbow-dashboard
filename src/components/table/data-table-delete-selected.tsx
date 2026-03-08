import { Trash } from "lucide-react";
import { useState } from "react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";

interface DataTableDeleteSelectedProps {
	selectedIds: string[];
	isDeleting: boolean;
	handleDeleteSelected: () => void;
	showDeleteAll?: boolean;
}

export default function DataTableDeleteSelected({
	selectedIds,
	isDeleting,
	handleDeleteSelected,
	showDeleteAll = false
}: DataTableDeleteSelectedProps) {
	const [isOpen, setIsOpen] = useState(false);

	const deleteLabel =
		selectedIds.length > 0 ? `Delete (${selectedIds.length})` : "Delete All";

	const handleConfirm = () => {
		handleDeleteSelected();
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				{(selectedIds.length > 0 || showDeleteAll) && (
					<Button size="sm" className="hidden h-8 lg:flex" variant="destructive">
						<Trash className="size-4" aria-hidden="true" />
						{deleteLabel}
					</Button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. Selected items will be permanently deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<DeleteButton
						deleteText={deleteLabel}
						cancelText="Cancel Deletion"
						countdownSeconds={10}
						onConfirm={handleConfirm}
						onCancel={() => setIsOpen(false)}
						disabled={isDeleting}
						className="w-full sm:w-auto"
					/>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
