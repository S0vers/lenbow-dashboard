import type { EmailBlock } from "@/redux/@types/EmailTemplates";

interface BlockPropertiesPanelProps {
	block: EmailBlock | null;
	onChange: (block: EmailBlock) => void;
}

export function BlockPropertiesPanel({ block, onChange }: BlockPropertiesPanelProps) {
	if (!block) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-muted/40 px-4 py-10 text-xs text-muted-foreground">
				Select a block to edit its properties.
			</div>
		);
	}

	const updateProp = (key: string, value: unknown) => {
		onChange({
			...block,
			props: {
				...block.props,
				[key]: value
			}
		});
	};

	return (
		<div className="flex flex-1 flex-col gap-3 rounded-md border bg-background p-3 text-xs">
			<div className="flex items-center justify-between">
				<h2 className="text-xs font-semibold capitalize">
					{block.type.replace("_", " ")} settings
				</h2>
			</div>

			{block.type === "hero" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Title</span>
						<input
							type="text"
							value={(block.props["title"] as string) ?? ""}
							onChange={e => updateProp("title", e.target.value)}
							className="h-7 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Subtitle</span>
						<textarea
							value={(block.props["subtitle"] as string) ?? ""}
							onChange={e => updateProp("subtitle", e.target.value)}
							className="min-h-[60px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
				</div>
			)}

			{block.type === "text" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Content</span>
						<textarea
							value={(block.props["content"] as string) ?? ""}
							onChange={e => updateProp("content", e.target.value)}
							className="min-h-[80px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
				</div>
			)}

			{block.type === "button" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Label</span>
						<input
							type="text"
							value={(block.props["label"] as string) ?? ""}
							onChange={e => updateProp("label", e.target.value)}
							className="h-7 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">URL</span>
						<input
							type="url"
							value={(block.props["href"] as string) ?? ""}
							onChange={e => updateProp("href", e.target.value)}
							className="h-7 rounded-md border px-2 text-xs"
						/>
					</label>
				</div>
			)}

			{block.type === "image" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Image URL</span>
						<input
							type="url"
							value={(block.props["src"] as string) ?? ""}
							onChange={e => updateProp("src", e.target.value)}
							className="h-7 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Alt text</span>
						<input
							type="text"
							value={(block.props["alt"] as string) ?? ""}
							onChange={e => updateProp("alt", e.target.value)}
							className="h-7 rounded-md border px-2 text-xs"
						/>
					</label>
				</div>
			)}
		</div>
	);
}

