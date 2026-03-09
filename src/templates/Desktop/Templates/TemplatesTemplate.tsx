"use client";

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
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	const builderTemplate: BuilderEmailTemplate | null =
		activeTemplate && activeTemplate.type === "builder" ? activeTemplate : null;

	const blocks: EmailBlock[] = builderTemplate?.blocks ?? [];

	const handleAddBlock = (type: EmailBlock["type"]) => {
		if (!builderTemplate) return;

		const nextBlock: EmailBlock = {
			id: crypto.randomUUID(),
			type,
			props: {}
		};

		const nextTemplate: EmailTemplate = {
			...builderTemplate,
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

	return (
		<div className="flex h-full flex-col gap-4">
			<header className="flex items-center justify-between gap-2">
				<div className="flex flex-col">
					<h1 className="text-xl font-semibold">Email templates</h1>
					<p className="text-sm text-muted-foreground">
						Manage and preview reusable email templates for your workspace.
					</p>
				</div>
				<div className="flex gap-2">
					<button className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
						New template
					</button>
				</div>
			</header>

			<Card className="flex min-h-0 flex-1 overflow-hidden">
				<div className="grid h-full w-full grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
					<section className="flex min-h-0 flex-col gap-3">
						<Tabs defaultValue="builder" className="flex h-full flex-col">
							<TabsList className="w-fit">
								<TabsTrigger value="builder">Builder</TabsTrigger>
								<TabsTrigger value="raw_html">Raw HTML</TabsTrigger>
							</TabsList>

							<TabsContent value="builder" className="mt-4 flex flex-1 flex-col gap-3">
								<div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
									<div className="flex flex-col gap-3">
										<BlockPalette onAddBlock={handleAddBlock} />
										<BuilderCanvas
											blocks={blocks}
											selectedBlockId={selectedBlockId}
											onSelectBlock={setSelectedBlockId}
											onDeleteBlock={handleDeleteBlock}
										/>
									</div>
									<BlockPropertiesPanel block={selectedBlock} onChange={handleUpdateBlock} />
								</div>
							</TabsContent>

							<TabsContent value="raw_html" className="mt-4 flex-1">
								<div className="flex h-full flex-col gap-3">
									<div className="grid flex-1 grid-rows-[minmax(0,1fr)_minmax(0,0.9fr)] gap-3">
										<div className="flex flex-col gap-1">
											<div className="flex items-center justify-between">
												<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
													HTML
												</h2>
											</div>
											<div className="min-h-[160px] flex-1 overflow-hidden rounded-md border">
												<CodeEditor
													language="html"
													value={
														activeTemplate?.type === "raw_html"
															? activeTemplate.html
															: ""
													}
													onChange={next => {
														if (!activeTemplate || activeTemplate.type !== "raw_html")
															return;
														setActiveTemplate({ ...activeTemplate, html: next });
													}}
												/>
											</div>
										</div>
										<div className="flex flex-col gap-1">
											<div className="flex items-center justify-between">
												<h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
													CSS
												</h2>
											</div>
											<div className="min-h-[120px] flex-1 overflow-hidden rounded-md border">
												<CodeEditor
													language="css"
													value={
														activeTemplate?.type === "raw_html"
															? activeTemplate.css ?? ""
															: ""
													}
													onChange={next => {
														if (!activeTemplate || activeTemplate.type !== "raw_html")
															return;
														setActiveTemplate({ ...activeTemplate, css: next });
													}}
												/>
											</div>
										</div>
									</div>
									<p className="text-[11px] text-muted-foreground">
										HTML and CSS will be sanitized and validated before sending. Avoid
										scripts, inline event handlers, and unsupported CSS for email clients.
									</p>
								</div>
							</TabsContent>
						</Tabs>
					</section>

					<section className="flex min-h-0 flex-col gap-3">
						<h2 className="text-sm font-medium text-muted-foreground">Preview</h2>
						<Card className="flex min-h-0 flex-1 overflow-hidden border-dashed">
							<EmailTemplatePreview template={activeTemplate} mode="desktop" theme="light" />
						</Card>
					</section>
				</div>
			</Card>
		</div>
	);
}


