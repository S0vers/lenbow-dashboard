import type { EmailTemplate } from "@/redux/@types/EmailTemplates";

const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];

const DEFAULT_SAMPLE_DATA: Record<string, unknown> = {
	firstName: "Alex"
};

function interpolate(input: string | null | undefined, data: Record<string, unknown>): string {
	if (!input) return "";
	return input.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		const value = data[key];
		return typeof value === "string" || typeof value === "number" ? String(value) : "";
	});
}

export function renderEmailTemplate(
	template: EmailTemplate,
	data: Record<string, unknown>
): { html: string; text: string } {
	const mergedData = { ...DEFAULT_SAMPLE_DATA, ...data };

	if (template.type === "builder") {
		const blocksHtml = template.blocks
			.map(block => {
				switch (block.type) {
					case "hero": {
						const title = interpolate(block.props["title"] as string, mergedData);
						const subtitle = interpolate(block.props["subtitle"] as string, mergedData);
						const buttonLabel = interpolate(block.props["buttonLabel"] as string, mergedData);
						const buttonHref = interpolate(block.props["buttonHref"] as string, mergedData);
						const align = (block.props["align"] as string) ?? "center";
						const backgroundColor = (block.props["backgroundColor"] as string) ?? "#0f172a";
						const textColor = (block.props["textColor"] as string) ?? "#f9fafb";
						const buttonColor = (block.props["buttonColor"] as string) ?? "#22c55e";
						const paddingY = Number(block.props["paddingY"] ?? 32);
						const paddingX = Number(block.props["paddingX"] ?? 24);

						return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
  <tr>
    <td align="${align}">
      <div style="background:${backgroundColor};color:${textColor};padding:${paddingY}px ${paddingX}px;border-radius:8px;">
        ${title ? `<h1 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">${escapeHtml(title)}</h1>` : ""}
        ${
					subtitle
						? `<p style="margin:0 0 12px 0;font-size:13px;line-height:1.5;">${escapeHtml(subtitle)}</p>`
						: ""
				}
        ${
					buttonLabel
						? `<a href="${escapeHtml(
								buttonHref || "#"
							)}" style="display:inline-block;background:${buttonColor};color:#0f172a;padding:8px 16px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;">${escapeHtml(
								buttonLabel
							)}</a>`
						: ""
				}
      </div>
    </td>
  </tr>
</table>`;
					}
					case "text": {
						const content = interpolate(block.props["content"] as string, mergedData);
						return `
<p style="margin:0 0 12px 0;font-size:13px;line-height:1.6;">${escapeHtml(content)}</p>`;
					}
					case "button": {
						const label = interpolate(block.props["label"] as string, mergedData);
						const href = interpolate(block.props["href"] as string, mergedData);
						const align = (block.props["align"] as string) ?? "center";
						const backgroundColor = (block.props["backgroundColor"] as string) ?? "#22c55e";
						const textColor = (block.props["textColor"] as string) ?? "#0f172a";
						if (!label) return "";
						return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
  <tr>
    <td align="${align}">
      <a href="${escapeHtml(
				href || "#"
			)}" style="display:inline-block;background:${backgroundColor};color:${textColor};padding:8px 16px;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;">${escapeHtml(
							label
						)}</a>
    </td>
  </tr>
</table>`;
					}
					case "image": {
						const src = block.props["src"] as string;
						const alt = block.props["alt"] as string;
						const align = (block.props["align"] as string) ?? "center";
						const width = Number(block.props["width"] ?? 600);
						const borderRadius = Number(block.props["borderRadius"] ?? 0);
						if (!src) return "";
						return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
  <tr>
    <td align="${align}">
      <img src="${escapeHtml(src)}" alt="${escapeHtml(
							alt || ""
						)}" width="${width}" style="max-width:100%;border-radius:${borderRadius}px;" />
    </td>
  </tr>
</table>`;
					}
					case "divider": {
						const color = (block.props["color"] as string) ?? "#e5e7eb";
						const thickness = Number(block.props["thickness"] ?? 1);
						const marginY = Number(block.props["marginY"] ?? 20);
						return `
<hr style="border:0;border-top:${thickness}px solid ${color};margin:${marginY}px 0;" />`;
					}
					case "spacer": {
						const height = Number(block.props["height"] ?? 24);
						return `<div style="height:${height}px;"></div>`;
					}
					case "two_column": {
						const leftTitle = interpolate(block.props["leftTitle"] as string, mergedData);
						const leftContent = interpolate(block.props["leftContent"] as string, mergedData);
						const rightTitle = interpolate(block.props["rightTitle"] as string, mergedData);
						const rightContent = interpolate(block.props["rightContent"] as string, mergedData);
						return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
  <tr>
    <td width="50%" valign="top" style="padding-right:8px;">
      ${leftTitle ? `<div style="font-weight:600;margin-bottom:4px;">${escapeHtml(leftTitle)}</div>` : ""}
      ${
				leftContent
					? `<div style="font-size:13px;line-height:1.6;">${escapeHtml(leftContent)}</div>`
					: ""
			}
    </td>
    <td width="50%" valign="top" style="padding-left:8px;">
      ${rightTitle ? `<div style="font-weight:600;margin-bottom:4px;">${escapeHtml(rightTitle)}</div>` : ""}
      ${
				rightContent
					? `<div style="font-size:13px;line-height:1.6;">${escapeHtml(rightContent)}</div>`
					: ""
			}
    </td>
  </tr>
</table>`;
					}
					case "heading": {
						const text = interpolate(block.props["text"] as string, mergedData);
						const level = Number(block.props["level"] ?? 2);
						const align = (block.props["align"] as string) ?? "left";
						const color = (block.props["color"] as string) ?? "#0f172a";
						const marginBottom = Number(block.props["marginBottom"] ?? 16);
						const fontSize =
							level === 1 ? 20 : level === 2 ? 18 : 16;
						return `
<h${level} style="margin:0 0 ${marginBottom}px 0;font-size:${fontSize}px;font-weight:600;text-align:${align};color:${color};">
  ${escapeHtml(text)}
</h${level}>`;
					}
					case "list": {
						const items = ((block.props["items"] as string[]) ?? []).map(item =>
							interpolate(item, mergedData)
						);
						const style = (block.props["style"] as string) ?? "bullet";
						if (!items.length) return "";
						const tag = style === "numbered" ? "ol" : "ul";
						const listItems = items
							.map(item => `<li style="margin-bottom:4px;">${escapeHtml(item)}</li>`)
							.join("");
						return `
<${tag} style="margin:0 0 12px 20px;font-size:13px;line-height:1.6;">
  ${listItems}
</${tag}>`;
					}
					case "quote": {
						const text = interpolate(block.props["text"] as string, mergedData);
						const author = interpolate(block.props["author"] as string, mergedData);
						return `
<blockquote style="margin:0 0 12px 0;border-left:2px solid #e5e7eb;padding-left:8px;font-size:13px;line-height:1.6;font-style:italic;">
  ${escapeHtml(text)}
</blockquote>
${author ? `<div style="margin:0 0 8px 0;font-size:11px;color:#6b7280;">— ${escapeHtml(author)}</div>` : ""}`;
					}
					case "social_icons": {
						const items = (block.props["items"] as { type: string; href: string }[]) ?? [];
						const align = (block.props["align"] as string) ?? "center";
						if (!items.length) return "";
						const links = items
							.map(
								item =>
									`<a href="${escapeHtml(
										item.href
									)}" style="display:inline-block;margin-right:6px;margin-bottom:4px;padding:4px 10px;border-radius:999px;background:#f3f4f6;font-size:11px;color:#111827;text-decoration:none;">${escapeHtml(
										item.type
									)}</a>`
							)
							.join("");
						return `
<div style="margin:0 0 12px 0;text-align:${align};">
  ${links}
</div>`;
					}
					case "footer": {
						const text = interpolate(block.props["text"] as string, mergedData);
						const unsubscribeUrl = interpolate(
							block.props["unsubscribeUrl"] as string,
							mergedData
						);
						return `
<footer style="margin-top:24px;border-top:1px solid #e5e7eb;padding-top:12px;font-size:11px;color:#6b7280;">
  <p style="margin:0 0 4px 0;">${escapeHtml(text)}</p>
  ${
		unsubscribeUrl
			? `<p style="margin:0;"><a href="${escapeHtml(
					unsubscribeUrl
				)}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a></p>`
			: ""
	}
</footer>`;
					}
					default:
						return "";
				}
			})
			.join("");

		const html = `<html><body style="margin:0;padding:24px;background:#f3f4f6;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#ffffff;border-radius:12px;padding:20px;">
        <tr>
          <td>
            ${blocksHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body></html>`;

		const textLines: string[] = [template.subject, ""];
		for (const block of template.blocks) {
			switch (block.type) {
				case "hero":
				case "heading":
					if (block.props["title"]) {
						textLines.push(String(block.props["title"]));
					}
					if (block.props["text"]) {
						textLines.push(String(block.props["text"]));
					}
					break;
				case "text":
					if (block.props["content"]) {
						textLines.push(String(block.props["content"]));
					}
					break;
				case "button":
					if (block.props["label"]) {
						textLines.push(`[Button] ${String(block.props["label"])}`);
					}
					break;
				case "list":
					((block.props["items"] as string[]) ?? []).forEach(item =>
						textLines.push(`- ${item}`)
					);
					break;
				case "quote":
					if (block.props["text"]) {
						textLines.push(`"${String(block.props["text"])}"`);
					}
					break;
				case "footer":
					if (block.props["text"]) {
						textLines.push(String(block.props["text"]));
					}
					break;
				default:
					break;
			}
		}

		const text = textLines.join("\n");

		return { html, text };
	}

	const interpolatedHtml = interpolate(template.html, mergedData);
	const rawCss = (template as any).css as string | null | undefined;
	const interpolatedCss = interpolate(rawCss ?? "", mergedData);
	const combined =
		interpolatedCss.trim().length > 0
			? `<style>${interpolatedCss}</style>\n${interpolatedHtml}`
			: interpolatedHtml;
	const sanitizedHtml = sanitizeEmailHtml(combined);
	const text = `${template.subject}\n\n${interpolatedHtml.replace(/<[^>]+>/g, "")}`;

	return { html: sanitizedHtml, text };
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function sanitizeEmailHtml(html: string): string {
	let output = html.replace(/<\s*script[\s\S]*?<\/\s*script\s*>/gi, "");

	output = output.replace(/\son[a-z]+\s*=\s*"(.*?)"/gi, "");
	output = output.replace(/\son[a-z]+\s*=\s*'(.*?)'/gi, "");

	output = output.replace(
		/\s(href|src)\s*=\s*"(.*?)"/gi,
		(_, attr, value: string) => ` ${attr}="${sanitizeUrl(value)}"`
	);
	output = output.replace(
		/\s(href|src)\s*=\s*'(.*?)'/gi,
		(_, attr, value: string) => ` ${attr}="${sanitizeUrl(value)}"`
	);

	return output;
}

function sanitizeUrl(raw: string): string {
	try {
		const url = new URL(raw, "https://placeholder.local");
		if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
			return "#";
		}
		return raw;
	} catch {
		return "#";
	}
}

