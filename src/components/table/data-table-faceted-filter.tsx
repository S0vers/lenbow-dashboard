import { Check, PlusCircle } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import { SmoothDropdown } from "@/components/custom-ui/SmoothDropdown";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps {
	title?: string;
	queryParameter: string;
	selectedGlobalValues: GlobalValues | undefined;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	searchParams: URLSearchParams;
	options:
		| {
				label: string;
				value: string;
				icon?: React.ComponentType<{ className?: string }>;
		  }[]
		| undefined;
}

export function DataTableFacetedFilter({
	title,
	queryParameter,
	selectedGlobalValues,
	searchParams,
	handleOptionFilter,
	options
}: DataTableFacetedFilterProps) {
	const defaultValue = searchParams.get(queryParameter) || undefined;

	const value = defaultValue?.split(",");

	// Derive selectedValues from URL params instead of storing in state
	const selectedValues = useMemo(() => {
		const urlValue = searchParams.get(queryParameter);
		return urlValue ? urlValue.split(",") : undefined;
	}, [searchParams, queryParameter]);

	const handleSelect = (value: string) => {
		if (selectedValues?.includes(value)) {
			const filteredValues = selectedValues?.filter(val => val !== value);
			handleOptionFilter(queryParameter, filteredValues.length > 0 ? filteredValues : undefined);
		} else {
			handleOptionFilter(queryParameter, [...(selectedValues || []), value].join(","));
		}
	};

	const handleClearFilter = () => {
		handleOptionFilter(queryParameter, undefined);
	};

	return (
		<SmoothDropdown triggerIcon={PlusCircle} triggerLabel={title}>
			<div className="mb-2 flex items-center justify-between gap-2 px-1">
				<span className="text-muted-foreground text-xs font-semibold">
					Filters
				</span>
				{selectedValues &&
					options?.find(option => selectedValues.includes(option.value)) &&
					selectedValues.length > 0 && (
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="rounded-full px-2 text-xs font-normal">
								{selectedValues.length} selected
							</Badge>
						</div>
					)}
			</div>
			<div className="border-border/80 mb-2 rounded-xl border bg-background px-1.5 py-1">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options?.map(option => {
								const isSelected = selectedValues?.includes(option.value);
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											handleSelect(option.value);
										}}
									>
										<div
											className={cn(
												"border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible"
											)}
										>
											<Check />
										</div>
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues &&
							options?.find(option => selectedValues.includes(option.value)) &&
							selectedValues.length > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											onSelect={handleClearFilter}
											className="justify-center text-center text-xs font-medium"
										>
											Clear filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
					</CommandList>
				</Command>
			</div>
		</SmoothDropdown>
	);
}
