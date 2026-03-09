import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockPalette } from "@/components/custom-ui/templates/BlockPalette";
import { BlockPropertiesPanel } from "@/components/custom-ui/templates/BlockPropertiesPanel";
import { BuilderCanvas } from "@/components/custom-ui/templates/BuilderCanvas";
import { CodeEditor } from "@/components/custom-ui/templates/CodeEditor";
import { EmailTemplatePreview } from "@/components/custom-ui/templates/EmailTemplatePreview";
import { useEmailTemplatesListQuery } from "@/redux/APISlices/EmailTemplatesAPISlice";
import type {
	BuilderEmailTemplate,
	EmailBlock,
	EmailTemplate
} from "@/redux/@types/EmailTemplates";

export default function TemplatesTemplate() {
	const { data } = useEmailTemplatesListQuery();
	const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(null);
	const [mode, setMode] = useState<"builder" | "raw_html">("builder");
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	const builderTemplate: BuilderEmailTemplate | null =
		activeTemplate && activeTemplate.type === "builder" ? activeTemplate : null;

	const blocks: EmailBlock[] = builderTemplate?.blocks ?? [];

	const handleAddBlock = (type: EmailBlock["type"]) => {
		const baseTemplate =
			builderTemplate ?? {
				id: crypto.randomUUID(),
				workspaceId: "local-draft",
				name: "Untitled template",
				subject: "Untitled subject",
				description: null,
				type: "builder" as const,
				isDefault: false,
				category: null,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				blocks: []
			};

		const nextBlock: EmailBlock = {
			id: crypto.randomUUID(),
			type,
			props: {}
		};

		const nextTemplate: EmailTemplate = {
			...baseTemplate,
			blocks: [...blocks, nextBlock]
		};

		setActiveTemplate(nextTemplate);
		setSelectedBlockId(nextBlock.id);
	};

	const handleUpdateBlock = (updatedBlock: EmailBlock) => {
		if (!builderTemplate) return;

		const nextTemplate: EmailTemplate = {
			...builderTemplate,
			blocks: blocks.map(block => (block.id === updatedBlock.id ? updatedBlock : block))
		};

		setActiveTemplate(nextTemplate);
	};

	const handleDeleteBlock = (id: string) => {
		if (!builderTemplate) return;

		const nextTemplate: EmailTemplate = {
			...builderTemplate,
			blocks: blocks.filter(block => block.id !== id)
		};

		setActiveTemplate(nextTemplate);
		if (selectedBlockId === id) {
			setSelectedBlockId(null);
		}
	};

	const selectedBlock = blocks.find(block => block.id === selectedBlockId) ?? null;

	const handleModeChange = (value: string) => {
		if (value !== "builder" && value !== "raw_html") return;
		setMode(value);
		setSelectedBlockId(null);
	};

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<header className="flex flex-col gap-1">
				<h1 className="text-lg font-semibold">Email templates</h1>
				<p className="text-xs text-muted-foreground">
					Build and preview templates on the go.
				</p>
			</header>

			<Card className="flex flex-1 flex-col gap-3 p-3">
				<Tabs value={mode} onValueChange={handleModeChange} className="flex h-full flex-col">
					<TabsList className="w-full">
						<TabsTrigger className="flex-1" value="builder">
							Builder
						</TabsTrigger>
						<TabsTrigger className="flex-1" value="raw_html">
							Raw HTML
						</TabsTrigger>
					</TabsList>
					<TabsContent value="builder" className="mt-3 flex-1">
						<div className="flex h-full flex-col gap-3">
							<BlockPalette onAddBlock={handleAddBlock} />
							<BuilderCanvas
								blocks={blocks}
								selectedBlockId={selectedBlockId}
								onSelectBlock={setSelectedBlockId}
								onDeleteBlock={handleDeleteBlock}
							/>
							<BlockPropertiesPanel block={selectedBlock} onChange={handleUpdateBlock} />
						</div>
					</TabsContent>
					<TabsContent value="raw_html" className="mt-3 flex-1">
						<div className="flex h-full flex-col gap-3">
							<div className="flex-1 rounded-md border">
								<CodeEditor
									language="html"
									value={
										activeTemplate?.type === "raw_html" ? activeTemplate.html : "<p>Hello</p>"
									}
									onChange={next => {
										if (!activeTemplate || activeTemplate.type !== "raw_html") {
											const now = new Date().toISOString();
											setActiveTemplate({
												id: crypto.randomUUID(),
												workspaceId: "local-draft",
												name: "Untitled template",
												subject: "Untitled subject",
												description: null,
												type: "raw_html",
												isDefault: false,
												category: null,
												createdAt: now,
												updatedAt: now,
												html: next,
												css: ""
											});
											return;
										}

										setActiveTemplate({ ...activeTemplate, html: next });
									}}
								/>
							</div>
							<div className="flex-1 rounded-md border">
								<EmailTemplatePreview template={activeTemplate} mode="mobile" theme="light" />
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}


