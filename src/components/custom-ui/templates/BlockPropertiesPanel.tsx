import InputNumeric from "@/components/ui/input-numeric";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
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
							className="h-9 rounded-md border px-2 text-xs"
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
					<label className="flex flex-col gap-1">
						<span className="font-medium">Button label</span>
						<input
							type="text"
							value={(block.props["buttonLabel"] as string) ?? ""}
							onChange={e => updateProp("buttonLabel", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Button URL</span>
						<input
							type="url"
							value={(block.props["buttonHref"] as string) ?? ""}
							onChange={e => updateProp("buttonHref", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Align</span>
							<Select
								value={(block.props["align"] as string) ?? "center"}
								onValueChange={value => updateProp("align", value)}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="center">Center</SelectItem>
									<SelectItem value="right">Right</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Background</span>
							<input
								type="text"
								placeholder="#0f172a"
								value={(block.props["backgroundColor"] as string) ?? ""}
								onChange={e => updateProp("backgroundColor", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Text color</span>
							<input
								type="text"
								placeholder="#ffffff"
								value={(block.props["textColor"] as string) ?? ""}
								onChange={e => updateProp("textColor", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Button color</span>
							<input
								type="text"
								placeholder="#22c55e"
								value={(block.props["buttonColor"] as string) ?? ""}
								onChange={e => updateProp("buttonColor", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Padding Y</span>
							<InputNumeric
								numberType="integer"
								numberSign="positive"
								min={0}
								max={96}
								value={
									block.props["paddingY"] === null || block.props["paddingY"] === undefined
										? ""
										: String(block.props["paddingY"])
								}
								onChange={e =>
									updateProp(
										"paddingY",
										e.target.value === "" ? null : Number(e.target.value)
									)
								}
								className="h-9 px-2 text-xs"
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Padding X</span>
							<InputNumeric
								numberType="integer"
								numberSign="positive"
								min={0}
								max={96}
								value={
									block.props["paddingX"] === null || block.props["paddingX"] === undefined
										? ""
										: String(block.props["paddingX"])
								}
								onChange={e =>
									updateProp(
										"paddingX",
										e.target.value === "" ? null : Number(e.target.value)
									)
								}
								className="h-9 px-2 text-xs"
							/>
						</label>
					</div>
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
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Align</span>
							<Select
								value={(block.props["align"] as string) ?? "left"}
								onValueChange={value => updateProp("align", value)}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="center">Center</SelectItem>
									<SelectItem value="right">Right</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Text color</span>
							<input
								type="text"
								placeholder="#0f172a"
								value={(block.props["textColor"] as string) ?? ""}
								onChange={e => updateProp("textColor", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
					</div>
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
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">URL</span>
						<input
							type="url"
							value={(block.props["href"] as string) ?? ""}
							onChange={e => updateProp("href", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Align</span>
							<Select
								value={(block.props["align"] as string) ?? "center"}
								onValueChange={value => updateProp("align", value)}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="center">Center</SelectItem>
									<SelectItem value="right">Right</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Background</span>
							<input
								type="text"
								placeholder="#22c55e"
								value={(block.props["backgroundColor"] as string) ?? ""}
								onChange={e => updateProp("backgroundColor", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
					</div>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Text color</span>
						<input
							type="text"
							placeholder="#0f172a"
							value={(block.props["textColor"] as string) ?? ""}
							onChange={e => updateProp("textColor", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
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
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Alt text</span>
						<input
							type="text"
							value={(block.props["alt"] as string) ?? ""}
							onChange={e => updateProp("alt", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Align</span>
							<Select
								value={(block.props["align"] as string) ?? "center"}
								onValueChange={value => updateProp("align", value)}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="center">Center</SelectItem>
									<SelectItem value="right">Right</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Width (px)</span>
							<InputNumeric
								numberType="integer"
								numberSign="positive"
								min={1}
								max={1200}
								value={
									block.props["width"] === null || block.props["width"] === undefined
										? ""
										: String(block.props["width"])
								}
								onChange={e =>
									updateProp("width", e.target.value === "" ? null : Number(e.target.value))
								}
								className="h-9 px-2 text-xs"
							/>
						</label>
					</div>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Border radius (px)</span>
						<InputNumeric
							numberType="integer"
							numberSign="positive"
							min={0}
							max={48}
							value={
								block.props["borderRadius"] === null ||
								block.props["borderRadius"] === undefined
									? ""
									: String(block.props["borderRadius"])
							}
							onChange={e =>
								updateProp(
									"borderRadius",
									e.target.value === "" ? null : Number(e.target.value)
								)
							}
							className="h-9 px-2 text-xs"
						/>
					</label>
				</div>
			)}

			{block.type === "heading" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Text</span>
						<input
							type="text"
							value={(block.props["text"] as string) ?? ""}
							onChange={e => updateProp("text", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Level</span>
							<Select
								value={String(block.props["level"] ?? 2)}
								onValueChange={value =>
									updateProp("level", value === "" ? undefined : Number(value))
								}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">H1</SelectItem>
									<SelectItem value="2">H2</SelectItem>
									<SelectItem value="3">H3</SelectItem>
								</SelectContent>
							</Select>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Align</span>
							<Select
								value={(block.props["align"] as string) ?? "left"}
								onValueChange={value => updateProp("align", value)}
							>
								<SelectTrigger className="h-9 px-2 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="left">Left</SelectItem>
									<SelectItem value="center">Center</SelectItem>
									<SelectItem value="right">Right</SelectItem>
								</SelectContent>
							</Select>
						</label>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<label className="flex flex-col gap-1">
							<span className="font-medium">Color</span>
							<input
								type="text"
								placeholder="#0f172a"
								value={(block.props["color"] as string) ?? ""}
								onChange={e => updateProp("color", e.target.value)}
								className="h-9 rounded-md border px-2 text-xs"
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="font-medium">Margin bottom</span>
							<InputNumeric
								numberType="integer"
								numberSign="positive"
								min={0}
								max={64}
								value={
									block.props["marginBottom"] === null ||
									block.props["marginBottom"] === undefined
										? ""
										: String(block.props["marginBottom"])
								}
								onChange={e =>
									updateProp(
										"marginBottom",
										e.target.value === "" ? null : Number(e.target.value)
									)
								}
								className="h-9 px-2 text-xs"
							/>
						</label>
					</div>
				</div>
			)}

			{block.type === "list" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Items (one per line)</span>
						<textarea
							value={((block.props["items"] as string[]) ?? []).join("\n")}
							onChange={e =>
								updateProp(
									"items",
									e.target.value
										.split("\n")
										.map(line => line.trim())
										.filter(Boolean)
								)
							}
							className="min-h-[80px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Style</span>
						<Select
							value={(block.props["style"] as string) ?? "bullet"}
							onValueChange={value => updateProp("style", value)}
						>
							<SelectTrigger className="h-9 px-2 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="bullet">Bullet</SelectItem>
								<SelectItem value="numbered">Numbered</SelectItem>
							</SelectContent>
						</Select>
					</label>
				</div>
			)}

			{block.type === "quote" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Quote</span>
						<textarea
							value={(block.props["text"] as string) ?? ""}
							onChange={e => updateProp("text", e.target.value)}
							className="min-h-[80px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Author</span>
						<input
							type="text"
							value={(block.props["author"] as string) ?? ""}
							onChange={e => updateProp("author", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
				</div>
			)}

			{block.type === "social_icons" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Links (one URL per line)</span>
						<textarea
							value={((block.props["items"] as { type: string; href: string }[]) ?? [])
								.map(item => item.href)
								.join("\n")}
							onChange={e => {
								const currentItems =
									(block.props["items"] as { type: string; href: string }[]) ?? [];
								const baseTypes =
									currentItems.length > 0
										? currentItems.map(item => item.type)
										: ["website", "twitter", "facebook", "linkedin", "instagram"];
								const urls = e.target.value
									.split("\n")
									.map(line => line.trim())
									.filter(Boolean);
								const nextItems = urls.map((href, index) => ({
									type: baseTypes[index] ?? "website",
									href
								}));
								updateProp("items", nextItems);
							}}
							className="min-h-[80px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Align</span>
						<Select
							value={(block.props["align"] as string) ?? "center"}
							onValueChange={value => updateProp("align", value)}
						>
							<SelectTrigger className="h-9 px-2 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="left">Left</SelectItem>
								<SelectItem value="center">Center</SelectItem>
								<SelectItem value="right">Right</SelectItem>
							</SelectContent>
						</Select>
					</label>
				</div>
			)}

			{block.type === "footer" && (
				<div className="space-y-2">
					<label className="flex flex-col gap-1">
						<span className="font-medium">Text</span>
						<textarea
							value={(block.props["text"] as string) ?? ""}
							onChange={e => updateProp("text", e.target.value)}
							className="min-h-[60px] rounded-md border px-2 py-1 text-xs"
						/>
					</label>
					<label className="flex flex-col gap-1">
						<span className="font-medium">Unsubscribe URL</span>
						<input
							type="url"
							value={(block.props["unsubscribeUrl"] as string) ?? ""}
							onChange={e => updateProp("unsubscribeUrl", e.target.value)}
							className="h-9 rounded-md border px-2 text-xs"
						/>
					</label>
				</div>
			)}
		</div>
	);
}

