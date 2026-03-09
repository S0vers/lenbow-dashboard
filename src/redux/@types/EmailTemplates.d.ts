export type EmailTemplateType = "builder" | "raw_html";

export type EmailBlockType =
	| "hero"
	| "text"
	| "button"
	| "image"
	| "divider"
	| "spacer"
	| "two_column";

export interface EmailBlock {
	id: string;
	type: EmailBlockType;
	props: Record<string, unknown>;
	children?: EmailBlock[];
}

export interface EmailTemplateBase {
	id: string;
	workspaceId: string;
	name: string;
	subject: string;
	description?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface BuilderEmailTemplate extends EmailTemplateBase {
	type: Extract<EmailTemplateType, "builder">;
	blocks: EmailBlock[];
}

export interface RawHtmlEmailTemplate extends EmailTemplateBase {
	type: Extract<EmailTemplateType, "raw_html">;
	html: string;
	css?: string | null;
}

export type EmailTemplate = BuilderEmailTemplate | RawHtmlEmailTemplate;


