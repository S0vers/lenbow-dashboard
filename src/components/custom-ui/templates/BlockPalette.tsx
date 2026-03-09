import { emailBlockPresets } from "@/templates/config/emailBlockPresets";
import type { EmailBlockType } from "@/redux/@types/EmailTemplates";

interface BlockPaletteProps {
	onAddBlock: (type: EmailBlockType) => void;
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
	return (
		<div className="space-y-2">
			<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
				Blocks
			</h2>
			<div className="grid grid-cols-2 gap-2">
				{emailBlockPresets.map(block => (
					<button
						key={block.type}
						type="button"
						onClick={() => onAddBlock(block.type)}
						className="flex flex-col items-start gap-1 rounded-md border bg-card p-2 text-left text-xs hover:bg-accent"
					>
						<span className="font-medium">{block.label}</span>
						{block.description ? (
							<span className="line-clamp-2 text-[11px] text-muted-foreground">
								{block.description}
							</span>
						) : null}
					</button>
				))}
			</div>
		</div>
	);
}

