import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
	return (
		<div className="border-muted/40 bg-background flex w-full flex-col gap-4 rounded-lg border p-4">
			<div className="flex items-center justify-between gap-2">
				<Skeleton className="h-6 w-32" />
				<div className="flex gap-2">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
			<div className="border-border/60 divide-border/60 mt-2 overflow-hidden rounded-md border">
				{/* Header row */}
				<div className="bg-muted/60 grid grid-cols-4 gap-2 px-4 py-3">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-16 justify-self-end" />
				</div>
				{/* Body rows */}
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={index}
						className="grid grid-cols-4 items-center gap-2 border-t px-4 py-3"
					>
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-16 justify-self-end" />
					</div>
				))}
			</div>
		</div>
	);
}

