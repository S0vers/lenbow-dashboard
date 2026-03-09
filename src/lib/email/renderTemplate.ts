import type { EmailTemplate } from "@/redux/@types/EmailTemplates";

const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];

export function renderEmailTemplate(
	template: EmailTemplate,
	data: Record<string, unknown>
): { html: string; text: string } {
	if (template.type === "builder") {
		// TODO: Integrate React Email components and proper plain‑text rendering.
		const html = `<html><body><h1>${escapeHtml(template.subject)}</h1><p>This is a placeholder rendered builder template.</p></body></html>`;
		const text = `${template.subject}\n\nThis is a placeholder rendered builder template.`;
		return { html, text };
	}

	// Raw HTML template: perform minimal, safe interpolation and sanitization.
	const interpolate = (input: string | null | undefined) => {
		if (!input) return "";
		return input.replace(/\{\{(\w+)\}\}/g, (_, key) => {
			const value = data[key];
			return typeof value === "string" || typeof value === "number" ? String(value) : "";
		});
	};

	const interpolatedHtml = interpolate(template.html);
	const sanitizedHtml = sanitizeEmailHtml(interpolatedHtml);
	const text = `${template.subject}\n\n[Text rendering not yet implemented]`;

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

/**
 * Very small, conservative HTML sanitizer tailored for email content.
 * This is intentionally minimal and should be complemented with a
 * dedicated sanitizer on the backend before sending.
 */
function sanitizeEmailHtml(html: string): string {
	// Strip obvious script tags.
	let output = html.replace(/<\s*script[\s\S]*?<\/\s*script\s*>/gi, "");

	// Remove inline event handlers like onclick, onerror, etc.
	output = output.replace(/\son[a-z]+\s*=\s*"(.*?)"/gi, "");
	output = output.replace(/\son[a-z]+\s*=\s*'(.*?)'/gi, "");

	// Strip javascript: URLs.
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

