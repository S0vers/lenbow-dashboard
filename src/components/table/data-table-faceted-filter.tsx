import { Check, PlusCircle } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps {
	title?: string;
	queryParameter: string;
	selectedGlobalValues: GlobalValues | undefined;
	setSelectedGlobalValues: React.Dispatch<React.SetStateAction<GlobalValues | undefined>>;
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
	setSelectedGlobalValues,
	searchParams,
	handleOptionFilter,
	options
}: DataTableFacetedFilterProps) {
	const defaultValue = searchParams.get(queryParameter) || undefined;

	const value = defaultValue?.split(",");

	const [selectedValues, setSelectedValues] = useState<string[] | undefined>(
		!selectedGlobalValues ? undefined : value
	);

	const handleSelect = (value: string) => {
		if (selectedValues?.includes(value)) {
			const filteredValues = selectedValues?.filter(val => val !== value);
			setSelectedValues(filteredValues);
			setSelectedGlobalValues({ [queryParameter]: filteredValues });
			handleOptionFilter(queryParameter, filteredValues.length > 0 ? filteredValues : undefined);
		} else {
			setSelectedValues([...(selectedValues || []), value]);
			setSelectedGlobalValues({ [queryParameter]: [...(selectedValues || []), value] });
			handleOptionFilter(queryParameter, [...(selectedValues || []), value].join(","));
		}
	};

	const handleClearFilter = () => {
		setSelectedValues(undefined);
		handleOptionFilter(queryParameter, undefined);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircle />
					{title}
					{selectedValues &&
						options?.find(option => selectedValues.includes(option.value)) &&
						selectedValues.length > 0 && (
							<>
								<Separator orientation="vertical" className="mx-2 h-4" />
								<Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
									{selectedValues.length}
								</Badge>
								<div className="hidden space-x-1 lg:flex">
									{selectedValues.length > 2 ? (
										<Badge variant="secondary" className="rounded-sm px-1 font-normal">
											{selectedValues.length} selected
										</Badge>
									) : (
										options
											.filter(option => selectedValues.includes(option.value))
											.map(option => (
												<Badge
													variant="secondary"
													key={option.value}
													className="rounded-sm px-1 font-normal"
												>
													{option.label}
												</Badge>
											))
									)}
								</div>
							</>
						)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
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
											className="justify-center text-center"
										>
											Clear filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
