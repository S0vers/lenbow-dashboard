import type { EmailTemplate } from "@/redux/@types/EmailTemplates";

interface EmailTemplatePreviewProps {
	template: EmailTemplate | null;
	mode: "desktop" | "mobile";
	theme: "light" | "dark";
}

export function EmailTemplatePreview({ template, mode }: EmailTemplatePreviewProps) {
	if (!template) {
		return (
			<div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
				Select or create a template to see a live preview.
			</div>
		);
	}

	// NOTE: For now this is a stub while the React Email integration and sanitization layer
	// are implemented. It simply renders a minimal structural representation.

	if (template.type === "builder") {
		return (
			<div
				className={`mx-auto h-full max-w-[480px] overflow-y-auto rounded-md border bg-background p-4 text-xs ${
					mode === "mobile" ? "scale-[0.9]" : ""
				}`}
			>
				<div className="mb-3 border-b pb-2">
					<div className="text-[11px] font-medium text-muted-foreground">Subject</div>
					<div className="text-sm font-semibold">{template.subject}</div>
				</div>
				<div className="space-y-3">
					{template.blocks.map(block => (
						<div
							key={block.id}
							className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-[11px]"
						>
							<span className="font-semibold capitalize">{block.type.replace("_", " ")}</span>
						</div>
					))}
				</div>
			</div>
		);
	}

	// Raw HTML: just show a notice for now; full sanitized rendering will come with the security work.
	return (
		<div className="mx-auto flex h-full max-w-[480px] flex-col gap-2 overflow-y-auto rounded-md border bg-background p-4 text-xs">
			<div className="mb-3 border-b pb-2">
				<div className="text-[11px] font-medium text-muted-foreground">Subject</div>
				<div className="text-sm font-semibold">{template.subject}</div>
			</div>
			<div className="rounded-md border border-dashed bg-muted/40 p-3 text-[11px] text-muted-foreground">
				Raw HTML preview will render sanitized HTML and inline CSS here.
			</div>
		</div>
	);
}

