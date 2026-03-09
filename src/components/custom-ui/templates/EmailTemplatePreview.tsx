import type { EmailBlock, EmailTemplate } from "@/redux/@types/EmailTemplates";
import { renderEmailTemplate, sanitizeEmailHtml } from "@/lib/email/renderTemplate";

interface EmailTemplatePreviewProps {
	template: EmailTemplate | null;
	mode: "desktop" | "mobile";
	theme: "light" | "dark";
	sampleData?: Record<string, unknown>;
}

const DEFAULT_SAMPLE_DATA: Record<string, unknown> = {
	firstName: "Alex"
};

function interpolate(value: string, data: Record<string, unknown>): string {
	return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		const v = data[key];
		return typeof v === "string" || typeof v === "number" ? String(v) : "";
	});
}

function renderHero(block: EmailBlock, data: Record<string, unknown>) {
	const title = interpolate((block.props["title"] as string) ?? "", data);
	const subtitle = interpolate((block.props["subtitle"] as string) ?? "", data);
	const buttonLabel = interpolate((block.props["buttonLabel"] as string) ?? "", data);
	const buttonHref = interpolate((block.props["buttonHref"] as string) ?? "", data);
	const align = (block.props["align"] as string) ?? "center";
	const backgroundColor = (block.props["backgroundColor"] as string) ?? "#0f172a";
	const textColor = (block.props["textColor"] as string) ?? "#f9fafb";
	const buttonColor = (block.props["buttonColor"] as string) ?? "#22c55e";
	const paddingY = Number(block.props["paddingY"] ?? 32);
	const paddingX = Number(block.props["paddingX"] ?? 24);

	return (
		<section
			className="rounded-md"
			style={{
				backgroundColor,
				color: textColor,
				padding: `${paddingY}px ${paddingX}px`,
				textAlign: align as "left" | "center" | "right"
			}}
		>
			{title && <h1 className="mb-2 text-lg font-semibold">{title}</h1>}
			{subtitle && (
				<p className="mb-4 text-xs opacity-80 whitespace-pre-line">{subtitle}</p>
			)}
			{buttonLabel && (
				<a
					href={buttonHref || "#"}
					className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold"
					style={{
						backgroundColor: buttonColor,
						color: "#0f172a"
					}}
				>
					{buttonLabel}
				</a>
			)}
		</section>
	);
}

function renderText(block: EmailBlock, data: Record<string, unknown>) {
	const content = interpolate((block.props["content"] as string) ?? "", data);
	const align = (block.props["align"] as string) ?? "left";
	const textColor = (block.props["textColor"] as string) ?? "#0f172a";

	return (
		<p
			className="text-xs leading-relaxed whitespace-pre-line"
			style={{ textAlign: align as "left" | "center" | "right", color: textColor }}
		>
			{content}
		</p>
	);
}

function renderButton(block: EmailBlock, data: Record<string, unknown>) {
	const label = interpolate((block.props["label"] as string) ?? "", data);
	const href = interpolate((block.props["href"] as string) ?? "", data);
	const align = (block.props["align"] as string) ?? "center";
	const backgroundColor = (block.props["backgroundColor"] as string) ?? "#22c55e";
	const textColor = (block.props["textColor"] as string) ?? "#0f172a";

	if (!label) return null;

	return (
		<div style={{ textAlign: align as "left" | "center" | "right" }}>
			<a
				href={href || "#"}
				className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold"
				style={{ backgroundColor, color: textColor }}
			>
				{label}
			</a>
		</div>
	);
}

function renderImage(block: EmailBlock) {
	const src = (block.props["src"] as string) ?? "";
	const alt = (block.props["alt"] as string) ?? "";
	const align = (block.props["align"] as string) ?? "center";
	const width = Number(block.props["width"] ?? 600);
	const borderRadius = Number(block.props["borderRadius"] ?? 0);

	if (!src) return null;

	return (
		<div style={{ textAlign: align as "left" | "center" | "right" }}>
			<img
				src={src}
				alt={alt}
				style={{ maxWidth: "100%", width, borderRadius }}
			/>
		</div>
	);
}

function renderDivider(block: EmailBlock) {
	const color = (block.props["color"] as string) ?? "#e5e7eb";
	const thickness = Number(block.props["thickness"] ?? 1);
	const marginY = Number(block.props["marginY"] ?? 20);

	return (
		<hr
			style={{
				borderColor: color,
				borderWidth: thickness,
				marginTop: marginY,
				marginBottom: marginY
			}}
		/>
	);
}

function renderSpacer(block: EmailBlock) {
	const height = Number(block.props["height"] ?? 24);
	return <div style={{ height }} />;
}

function renderTwoColumn(block: EmailBlock, data: Record<string, unknown>) {
	const leftTitle = interpolate((block.props["leftTitle"] as string) ?? "", data);
	const leftContent = interpolate((block.props["leftContent"] as string) ?? "", data);
	const rightTitle = interpolate((block.props["rightTitle"] as string) ?? "", data);
	const rightContent = interpolate((block.props["rightContent"] as string) ?? "", data);
	const stackOnMobile = Boolean(block.props["stackOnMobile"]);

	return (
		<div
			className={`grid gap-3 text-xs ${
				stackOnMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
			}`}
		>
			<div className="space-y-1">
				{leftTitle && <div className="font-semibold">{leftTitle}</div>}
				{leftContent && (
					<p className="text-muted-foreground whitespace-pre-line">{leftContent}</p>
				)}
			</div>
			<div className="space-y-1">
				{rightTitle && <div className="font-semibold">{rightTitle}</div>}
				{rightContent && (
					<p className="text-muted-foreground whitespace-pre-line">{rightContent}</p>
				)}
			</div>
		</div>
	);
}

function renderHeading(block: EmailBlock, data: Record<string, unknown>) {
	const text = interpolate((block.props["text"] as string) ?? "", data);
	const level = Number(block.props["level"] ?? 2);
	const align = (block.props["align"] as string) ?? "left";
	const color = (block.props["color"] as string) ?? "#0f172a";
	const marginBottom = Number(block.props["marginBottom"] ?? 16);

	type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	const Tag = `h${Math.min(Math.max(level, 1), 6)}` as HeadingTag;

	return (
		<Tag
			className="font-semibold"
			style={{
				textAlign: align as "left" | "center" | "right",
				color,
				marginBottom
			}}
		>
			{text}
		</Tag>
	);
}

function renderList(block: EmailBlock, data: Record<string, unknown>) {
	const items = ((block.props["items"] as string[]) ?? []).map(item =>
		interpolate(item, data)
	);
	const style = (block.props["style"] as string) ?? "bullet";

	if (!items.length) return null;

	const ListTag = (style === "numbered" ? "ol" : "ul") as "ol" | "ul";

	return (
		<ListTag className="ml-5 list-disc text-xs leading-relaxed">
			{items.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ListTag>
	);
}

function renderQuote(block: EmailBlock, data: Record<string, unknown>) {
	const text = interpolate((block.props["text"] as string) ?? "", data);
	const author = interpolate((block.props["author"] as string) ?? "", data);

	return (
		<figure className="border-l-2 border-muted pl-3 text-xs">
			<blockquote className="italic whitespace-pre-line">“{text}”</blockquote>
			{author && <figcaption className="mt-1 text-[11px] text-muted-foreground">— {author}</figcaption>}
		</figure>
	);
}

function renderSocialIcons(block: EmailBlock) {
	const items = (block.props["items"] as { type: string; href: string }[]) ?? [];
	const align = (block.props["align"] as string) ?? "center";

	if (!items.length) return null;

	return (
		<div
			className="flex flex-wrap gap-2 text-[11px]"
			style={{ justifyContent: align as "flex-start" | "center" | "flex-end" }}
		>
			{items.map((item, index) => (
				<a
					key={`${item.type}-${index}`}
					href={item.href}
					className="rounded-full bg-muted px-3 py-1"
				>
					{item.type}
				</a>
			))}
		</div>
	);
}

function renderFooter(block: EmailBlock, data: Record<string, unknown>) {
	const text = interpolate((block.props["text"] as string) ?? "", data);
	const unsubscribeUrl = interpolate((block.props["unsubscribeUrl"] as string) ?? "", data);

	return (
		<footer className="mt-6 border-t pt-3 text-[11px] text-muted-foreground">
			<p className="whitespace-pre-line">{text}</p>
			{unsubscribeUrl && (
				<p className="mt-1">
					<a href={unsubscribeUrl} className="underline">
						Unsubscribe
					</a>
				</p>
			)}
		</footer>
	);
}

function renderBuilderBlocks(blocks: EmailBlock[], data: Record<string, unknown>) {
	return blocks.map(block => {
		switch (block.type) {
			case "hero":
				return (
					<div key={block.id} className="mb-4">
						{renderHero(block, data)}
					</div>
				);
			case "text":
				return (
					<div key={block.id} className="mb-3">
						{renderText(block, data)}
					</div>
				);
			case "button":
				return (
					<div key={block.id} className="mb-3">
						{renderButton(block, data)}
					</div>
				);
			case "image":
				return (
					<div key={block.id} className="mb-3">
						{renderImage(block)}
					</div>
				);
			case "divider":
				return (
					<div key={block.id}>
						{renderDivider(block)}
					</div>
				);
			case "spacer":
				return (
					<div key={block.id}>
						{renderSpacer(block)}
					</div>
				);
			case "two_column":
				return (
					<div key={block.id} className="mb-4">
						{renderTwoColumn(block, data)}
					</div>
				);
			case "heading":
				return (
					<div key={block.id}>
						{renderHeading(block, data)}
					</div>
				);
			case "list":
				return (
					<div key={block.id} className="mb-3">
						{renderList(block, data)}
					</div>
				);
			case "quote":
				return (
					<div key={block.id} className="mb-3">
						{renderQuote(block, data)}
					</div>
				);
			case "social_icons":
				return (
					<div key={block.id} className="mb-3">
						{renderSocialIcons(block)}
					</div>
				);
			case "footer":
				return (
					<div key={block.id}>
						{renderFooter(block, data)}
					</div>
				);
			default:
				return (
					<div key={block.id} className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-[11px]">
						<span className="font-semibold capitalize">
							{String(block.type).replace("_", " ")}
						</span>
					</div>
				);
		}
	});
}

export function EmailTemplatePreview({
	template,
	mode,
	theme,
	sampleData
}: EmailTemplatePreviewProps) {
	if (!template) {
		return (
			<div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
				Select or create a template to see a live preview.
			</div>
		);
	}

	const data = { ...DEFAULT_SAMPLE_DATA, ...(sampleData ?? {}) };
	const isMobile = mode === "mobile";
	const isDark = theme === "dark";

	const outerClasses =
		"mx-auto h-full overflow-y-auto rounded-xl border p-4 text-xs shadow-sm transition-all";
	const widthClass = isMobile ? "w-[380px] max-w-full" : "w-[760px] max-w-full";
	const backgroundClass = isDark
		? "bg-[#020617] text-neutral-100"
		: "bg-white text-neutral-900";

	if (template.type === "builder") {
		const { html } = renderEmailTemplate(template, data);
		const sanitized = sanitizeEmailHtml(html);

		return (
			<div className={`${outerClasses} ${widthClass} ${backgroundClass}`}>
				<div className="mb-3 border-b pb-2">
					<div className="text-[11px] font-medium text-muted-foreground">Subject</div>
					<div className="text-sm font-semibold">{template.subject}</div>
				</div>
				<div className="prose prose-xs max-w-none dark:prose-invert">
					<div dangerouslySetInnerHTML={{ __html: sanitized }} />
				</div>
			</div>
		);
	}

	const rawHtml = template.html ?? "";
	const rawCss = (template as any).css as string | null | undefined;
	const interpolatedHtml = interpolate(rawHtml, data);
	const interpolatedCss = interpolate(rawCss ?? "", data);
	const combined =
		interpolatedCss.trim().length > 0
			? `<style>${interpolatedCss}</style>\n${interpolatedHtml}`
			: interpolatedHtml;
	const sanitized = sanitizeEmailHtml(combined);

	return (
		<div className={`${outerClasses} ${widthClass} ${backgroundClass}`}>
			<div className="mb-3 border-b pb-2">
				<div className="text-[11px] font-medium text-muted-foreground">Subject</div>
				<div className="text-sm font-semibold">{template.subject}</div>
			</div>
			<div className="prose prose-xs max-w-none dark:prose-invert">
				<div dangerouslySetInnerHTML={{ __html: sanitized }} />
			</div>
		</div>
	);
}

