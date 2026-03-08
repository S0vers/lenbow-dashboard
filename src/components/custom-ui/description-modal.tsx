"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger
} from "@/components/ui/responsive-dialog";

interface DescriptionModalProps {
	description: string;
	trigger?: React.ReactNode;
}

export function DescriptionModal({ description, trigger }: DescriptionModalProps) {
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger asChild>
				{trigger || <button className="text-primary text-xs hover:underline">show more</button>}
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-125">
				<ResponsiveDialogHeader className="shrink-0 px-6 pt-6">
					<ResponsiveDialogTitle>Description</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>Full transaction description</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<div className="-mx-6 max-h-[50vh] min-h-0 flex-1 overflow-y-auto px-6">
					<p className="text-sm leading-relaxed whitespace-pre-wrap pb-4">{description}</p>
				</div>
				<ResponsiveDialogFooter className="shrink-0 border-t border-border bg-muted/30 px-6 py-4">
					<ResponsiveDialogClose asChild>
						<Button variant="outline">Close</Button>
					</ResponsiveDialogClose>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
