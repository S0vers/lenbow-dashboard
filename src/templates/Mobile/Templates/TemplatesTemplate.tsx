"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CopyIcon, SaveIcon } from "lucide-react";

import { BlockPalette } from "@/components/custom-ui/templates/BlockPalette";
import { BlockPropertiesPanel } from "@/components/custom-ui/templates/BlockPropertiesPanel";
import { BuilderCanvas } from "@/components/custom-ui/templates/BuilderCanvas";
import { CodeEditor } from "@/components/custom-ui/templates/CodeEditor";
import { EmailTemplatePreview } from "@/components/custom-ui/templates/EmailTemplatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useCreateEmailTemplateMutation,
	useEmailTemplatesListQuery,
	useUpdateEmailTemplateMutation
} from "@/redux/APISlices/EmailTemplatesAPISlice";
import { useSearchParams } from "next/navigation";
import type {
	BuilderEmailTemplate,
	EmailBlock,
	EmailTemplate,
	EmailTemplateType,
	RawHtmlEmailTemplate
} from "@/redux/@types/EmailTemplates";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveTemplateId, setDraftTemplate, setMode, setPreviewTheme, markSaved } from "@/redux/EmailTemplatesUISlice";
import { emailBlockPresets } from "@/templates/config/emailBlockPresets";
import { EmailTemplateSchema } from "@/validators/emailTemplates";
import { renderEmailTemplate } from "@/lib/email/renderTemplate";
import { toast } from "sonner";

function createDefaultBuilderTemplate(): BuilderEmailTemplate {
	const now = new Date().toISOString();

	return {
		id: crypto.randomUUID(),
		workspaceId: "local-draft",
		name: "Untitled template",
		subject: "Untitled subject",
		description: null,
		type: "builder",
		isDefault: false,
		category: null,
		createdAt: now,
		updatedAt: now,
		blocks: []
	};
}

function createDefaultRawHtmlTemplate(from?: EmailTemplate | null): EmailTemplate {
	const now = new Date().toISOString();

	return {
		id: from?.id ?? crypto.randomUUID(),
		workspaceId: from?.workspaceId ?? "local-draft",
		name: from?.name ?? "Untitled template",
		subject: from?.subject ?? "Untitled subject",
		description: from?.description ?? null,
		type: "raw_html",
		isDefault: Boolean(from?.isDefault),
		category: from?.category ?? null,
		createdAt: from?.createdAt ?? now,
		updatedAt: now,
		html: "<p>Hello {{firstName}},</p>",
		css: ""
	};
}

export default function TemplatesTemplate() {
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const templateIdFromQuery = searchParams.get("templateId");
	const {
		activeTemplateId,
		draftTemplate,
		mode,
		previewDevice,
		previewTheme,
		hasUnsavedChanges,
		sampleData
	} = useAppSelector(state => state.emailTemplatesUIReducer);

	const { data: listResponse, isLoading: isListLoading } = useEmailTemplatesListQuery();
	const templates = useMemo(() => listResponse?.data ?? [], [listResponse]);

	const [saveError, setSaveError] = useState<string | null>(null);

	const [createEmailTemplate, { isLoading: isCreating }] = useCreateEmailTemplateMutation();
	const [updateEmailTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();

	const effectiveTemplate: EmailTemplate | null = useMemo(() => {
		if (draftTemplate) return draftTemplate;
		if (activeTemplateId) {
			return templates.find(t => t.id === activeTemplateId) ?? null;
		}
		return templates[0] ?? null;
	}, [draftTemplate, activeTemplateId, templates]);

	const builderTemplate: BuilderEmailTemplate | null =
		effectiveTemplate && effectiveTemplate.type === "builder"
			? (effectiveTemplate as BuilderEmailTemplate)
			: null;

	const blocks: EmailBlock[] = builderTemplate?.blocks ?? [];
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const builderDraftBackupRef = useRef<BuilderEmailTemplate | null>(builderTemplate);

	useEffect(() => {
		if (isListLoading || templates.length === 0) return;

		const fromQuery = templateIdFromQuery
			? templates.find(t => t.id === templateIdFromQuery) ?? null
			: null;

		const preferred =
			fromQuery ??
			(templates.find(t => t.type === "builder") as EmailTemplate | undefined) ??
			(templates[0] as EmailTemplate);

		if (!preferred) return;

		if (!activeTemplateId || activeTemplateId !== preferred.id || !draftTemplate) {
			dispatch(setActiveTemplateId(preferred.id));
			dispatch(setDraftTemplate(preferred));
			dispatch(markSaved());
		}
	}, [isListLoading, templates, activeTemplateId, draftTemplate, templateIdFromQuery, dispatch]);

	useEffect(() => {
		if (draftTemplate && draftTemplate.type === "builder") {
			builderDraftBackupRef.current = draftTemplate as BuilderEmailTemplate;
		}
	}, [draftTemplate]);

	useEffect(() => {
		if (!hasUnsavedChanges) return;

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = "";
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	const handleAddBlock = (type: EmailBlock["type"]) => {
		const baseTemplate: BuilderEmailTemplate =
			draftTemplate && draftTemplate.type === "builder"
				? (draftTemplate as BuilderEmailTemplate)
				: createDefaultBuilderTemplate();

		const preset = emailBlockPresets.find(block => block.type === type);

		const nextBlock: EmailBlock = {
			id: crypto.randomUUID(),
			type,
			props: preset?.defaultProps ?? {}
		};

		const nextTemplate: EmailTemplate = {
			...baseTemplate,
			blocks: [...(baseTemplate.blocks ?? []), nextBlock]
		};

		dispatch(setDraftTemplate(nextTemplate));
		dispatch(setMode("builder"));
		setSelectedBlockId(nextBlock.id);
		setSaveError(null);
	};

	const handleUpdateBlock = (updatedBlock: EmailBlock) => {
		if (!draftTemplate || draftTemplate.type !== "builder") return;

		const currentBlocks = (draftTemplate as BuilderEmailTemplate).blocks ?? [];

		const nextTemplate: EmailTemplate = {
			...draftTemplate,
			blocks: currentBlocks.map(block => (block.id === updatedBlock.id ? updatedBlock : block))
		};

		dispatch(setDraftTemplate(nextTemplate));
		setSaveError(null);
	};

	const handleDeleteBlock = (id: string) => {
		if (!draftTemplate || draftTemplate.type !== "builder") return;

		const currentBlocks = (draftTemplate as BuilderEmailTemplate).blocks ?? [];

		const nextTemplate: EmailTemplate = {
			...draftTemplate,
			blocks: currentBlocks.filter(block => block.id !== id)
		};

		dispatch(setDraftTemplate(nextTemplate));
		if (selectedBlockId === id) {
			setSelectedBlockId(null);
		}
		setSaveError(null);
	};

	const selectedBlock = blocks.find(block => block.id === selectedBlockId) ?? null;

	const handleMoveBlock = (id: string, direction: "up" | "down") => {
		if (!draftTemplate || draftTemplate.type !== "builder") return;

		const currentBlocks = (draftTemplate as BuilderEmailTemplate).blocks ?? [];
		const index = currentBlocks.findIndex(block => block.id === id);
		if (index === -1) return;

		const newIndex = direction === "up" ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= currentBlocks.length) return;

		const nextBlocks = [...currentBlocks];
		const [moved] = nextBlocks.splice(index, 1);
		nextBlocks.splice(newIndex, 0, moved);

		const nextTemplate: EmailTemplate = {
			...draftTemplate,
			blocks: nextBlocks
		};

		dispatch(setDraftTemplate(nextTemplate));
		setSaveError(null);
	};

	const handleModeChange = (value: string) => {
		if (value !== "builder" && value !== "raw_html") return;

		const nextMode = value as EmailTemplateType;
		let nextTemplate: EmailTemplate;

		if (nextMode === "builder") {
			if (draftTemplate && draftTemplate.type === "builder") {
				nextTemplate = draftTemplate;
			} else if (builderDraftBackupRef.current) {
				nextTemplate = builderDraftBackupRef.current;
			} else {
				nextTemplate = createDefaultBuilderTemplate();
			}
		} else if (draftTemplate && draftTemplate.type === "raw_html") {
			nextTemplate = draftTemplate;
		} else {
			const sourceBuilder =
				(draftTemplate && draftTemplate.type === "builder"
					? (draftTemplate as BuilderEmailTemplate)
					: builderDraftBackupRef.current) ?? createDefaultBuilderTemplate();
			const { html } = renderEmailTemplate(sourceBuilder, sampleData ?? {});
			nextTemplate = {
				...sourceBuilder,
				type: "raw_html",
				html,
				css: (draftTemplate as any)?.css ?? ""
			} as RawHtmlEmailTemplate;
		}

		dispatch(setMode(nextMode));
		dispatch(setDraftTemplate(nextTemplate));
		setSelectedBlockId(null);
		setSaveError(null);
	};

	const handleSave = async () => {
		if (!draftTemplate) return;

		const parsed = EmailTemplateSchema.safeParse(draftTemplate);
		if (!parsed.success) {
			setSaveError(parsed.error.issues.map(issue => issue.message).join(", "));
			return;
		}

		setSaveError(null);

		const parsedTemplate = parsed.data;
		const isExisting = templates.some(t => t.id === draftTemplate.id);

		try {
			if (isExisting) {
				const { id, workspaceId, ...body } = parsedTemplate;
				const res = await updateEmailTemplate({
					templateId: id,
					body: body as any
				}).unwrap();
				const saved = res.data as EmailTemplate;
				dispatch(setDraftTemplate(saved));
				dispatch(setActiveTemplateId(saved.id));
				dispatch(markSaved());
			} else {
				const { id: _id, workspaceId: _ws, ...body } = parsedTemplate;
				const res = await createEmailTemplate(body as any).unwrap();
				const saved = res.data as EmailTemplate;
				dispatch(setDraftTemplate(saved));
				dispatch(setActiveTemplateId(saved.id));
				dispatch(markSaved());
			}
		} catch (error: any) {
			setSaveError(error?.data?.message ?? "Failed to save template");
		}
	};

	const isSaving = isCreating || isUpdating;

	const handleCopyHtml = async () => {
		if (!effectiveTemplate) return;

		try {
			const { html, text } = renderEmailTemplate(effectiveTemplate, sampleData ?? {});

			const clipboardAny = navigator.clipboard as any;
			const ClipboardItemCtor = (window as any).ClipboardItem;

			if (clipboardAny?.write && ClipboardItemCtor) {
				const item = new ClipboardItemCtor({
					"text/html": new Blob([html], { type: "text/html" }),
					"text/plain": new Blob([text], { type: "text/plain" })
				});
				await clipboardAny.write([item]);
			} else {
				await navigator.clipboard.writeText(html);
			}

			toast.success("Email content copied. Paste into your email client.");
		} catch {
			toast.error("Failed to copy email content.");
		}
	};

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<header className="flex flex-col gap-3">
				<div className="flex flex-col gap-1">
					<h1 className="text-lg font-semibold">Email templates</h1>
					<p className="text-xs text-muted-foreground">
						Build and preview templates on the go.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="inline-flex items-center gap-1"
						onClick={handleSave}
						disabled={isSaving || !draftTemplate || !hasUnsavedChanges}
					>
						<SaveIcon className="h-3 w-3" />
						<span>Save</span>
					</Button>
				</div>
				{saveError && (
					<p className="text-xs text-destructive">
						{saveError}
					</p>
				)}
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
								onMoveBlock={handleMoveBlock}
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
										effectiveTemplate?.type === "raw_html"
											? effectiveTemplate.html
											: "<p>Hello</p>"
									}
									onChange={next => {
										const base: RawHtmlEmailTemplate =
											draftTemplate && draftTemplate.type === "raw_html"
												? (draftTemplate as RawHtmlEmailTemplate)
												: (createDefaultRawHtmlTemplate(
														effectiveTemplate
												  ) as RawHtmlEmailTemplate);
										const updated: RawHtmlEmailTemplate = {
											...base,
											html: next
										};
										dispatch(setMode("raw_html"));
										dispatch(setDraftTemplate(updated));
										setSaveError(null);
									}}
								/>
							</div>
							<div className="flex flex-1 flex-col gap-2">
								<div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
									<div className="inline-flex items-center gap-1">
										<span>Preview</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="inline-flex h-7 items-center gap-1 px-2 text-[11px]"
											onClick={handleCopyHtml}
											disabled={!effectiveTemplate}
										>
											<CopyIcon className="h-3 w-3" />
											<span>Copy HTML</span>
										</Button>
									</div>
									<div className="inline-flex rounded-md border bg-muted/40 p-0.5">
										<Button
											type="button"
											variant={previewTheme === "light" ? "default" : "ghost"}
											size="sm"
											className="h-7 px-2 text-[11px]"
											onClick={() => dispatch(setPreviewTheme("light"))}
										>
											Light
										</Button>
										<Button
											type="button"
											variant={previewTheme === "dark" ? "default" : "ghost"}
											size="sm"
											className="h-7 px-2 text-[11px]"
											onClick={() => dispatch(setPreviewTheme("dark"))}
										>
											Dark
										</Button>
									</div>
								</div>
								<div className="flex-1 rounded-md border">
									<EmailTemplatePreview
										template={effectiveTemplate}
										mode="mobile"
										theme={previewTheme}
										sampleData={sampleData}
									/>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}


