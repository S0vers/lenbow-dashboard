"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
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
			<ResponsiveDialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-125">
				<ResponsiveDialogHeader className="shrink-0">
					<ResponsiveDialogTitle>Description</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>Full transaction description</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody className="min-h-0 flex-1 overflow-y-auto">
					<p className="text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter className="shrink-0 border-t border-border bg-muted/30">
					<ResponsiveDialogClose asChild>
						<Button variant="outline">Close</Button>
					</ResponsiveDialogClose>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
