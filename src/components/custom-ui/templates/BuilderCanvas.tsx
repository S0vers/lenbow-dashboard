import type { EmailBlock } from "@/redux/@types/EmailTemplates";

interface BuilderCanvasProps {
	blocks: EmailBlock[];
	selectedBlockId: string | null;
	onSelectBlock: (id: string) => void;
	onDeleteBlock: (id: string) => void;
}

export function BuilderCanvas({
	blocks,
	selectedBlockId,
	onSelectBlock,
	onDeleteBlock
}: BuilderCanvasProps) {
	if (!blocks.length) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-muted/40 px-4 py-10 text-sm text-muted-foreground">
				Add blocks from the palette to start building this email.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 rounded-md border bg-background p-2">
			{blocks.map(block => (
				<button
					type="button"
					key={block.id}
					onClick={() => onSelectBlock(block.id)}
					className={`flex items-start justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs ${
						selectedBlockId === block.id ? "border-primary bg-primary/5" : "border-border"
					}`}
				>
					<div className="flex flex-col">
						<span className="font-medium capitalize">{block.type.replace("_", " ")}</span>
						<span className="line-clamp-2 text-[11px] text-muted-foreground">
							{typeof block.props["title"] === "string"
								? (block.props["title"] as string)
								: typeof block.props["content"] === "string"
									? (block.props["content"] as string)
									: "No content yet"}
						</span>
					</div>
					<div className="flex items-center gap-1">
						<span
							role="button"
							onClick={event => {
								event.stopPropagation();
								onDeleteBlock(block.id);
							}}
							className="rounded-full px-2 py-1 text-[10px] font-medium text-destructive hover:bg-destructive/10"
						>
							Remove
						</span>
					</div>
				</button>
			))}
		</div>
	);
}

