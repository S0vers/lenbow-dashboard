"use client";

import type { Header, Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="pill"
					className="ml-auto hidden h-10 rounded-full px-4 text-sm shadow-sm lg:inline-flex"
				>
					<Settings2 />
					View
				</Button>
			</DropdownMenuTrigger>
			<AnimatePresence>
				{open && (
					<DropdownMenuContent
						align="end"
						className="w-37.5 border-border/60 bg-popover/95 p-0 backdrop-blur"
						forceMount
					>
						<motion.div
							initial={{ opacity: 0, y: 6, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 4, scale: 0.97 }}
							transition={{
								type: "spring",
								damping: 26,
								stiffness: 360,
								mass: 0.9,
								ease: easeOutQuint
							}}
						>
							<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter(
									column => typeof column.accessorFn !== "undefined" && column.getCanHide()
								)
								.map(column => {
									const headerContent = column.columnDef.header;

									let title = column.id;
									if (headerContent && typeof headerContent === "function") {
										const renderedHeader = headerContent({
											column,
											header: column.columnDef.header as unknown as Header<TData, unknown>,
											table
										});
										if (renderedHeader?.props?.title) {
											title = renderedHeader.props.title;
										}
									}

									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={value => column.toggleVisibility(!!value)}
										>
											{title}
										</DropdownMenuCheckboxItem>
									);
								})}
						</motion.div>
					</DropdownMenuContent>
				)}
			</AnimatePresence>
		</DropdownMenu>
	);
}

