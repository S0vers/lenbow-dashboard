import type { EmailBlock, EmailBlockType } from "@/redux/@types/EmailTemplates";

type EmailBlockPreset = {
	type: EmailBlockType;
	label: string;
	description?: string;
	icon?: string;
	defaultProps: EmailBlock["props"];
};

export const emailBlockPresets: EmailBlockPreset[] = [
	{
		type: "hero",
		label: "Hero",
		description: "Large header with title, text, and primary button.",
		defaultProps: {
			title: "Welcome to Lenbow",
			subtitle: "A better way to track who owes what.",
			buttonLabel: "Get started",
			buttonHref: "https://lenbow.com",
			align: "center",
			backgroundColor: "#0f172a",
			textColor: "#f9fafb",
			buttonColor: "#22c55e",
			paddingY: 32,
			paddingX: 24
		}
	},
	{
		type: "text",
		label: "Text",
		description: "Simple paragraph or rich text content.",
		defaultProps: {
			content:
				"Hi {{firstName}},\n\nHere’s a quick update on your recent activity in Lenbow.",
			align: "left",
			textColor: "#0f172a"
		}
	},
	{
		type: "button",
		label: "Button",
		description: "Call-to-action button.",
		defaultProps: {
			label: "View details",
			href: "https://lenbow.com",
			align: "center",
			backgroundColor: "#22c55e",
			textColor: "#0f172a"
		}
	},
	{
		type: "image",
		label: "Image",
		description: "Full-width image with optional link.",
		defaultProps: {
			src: "https://placehold.co/600x200",
			alt: "Banner",
			href: "",
			align: "center",
			width: 600,
			borderRadius: 0
		}
	},
    
	{
		type: "divider",
		label: "Divider",
		description: "Horizontal divider between sections.",
		defaultProps: {
			color: "#e5e7eb",
			thickness: 1,
			marginY: 20
		}
	},
	{
		type: "spacer",
		label: "Spacer",
		description: "Vertical white space.",
		defaultProps: {
			height: 24
		}
	},
	{
		type: "two_column",
		label: "Two-column",
		description: "Side-by-side content for summaries.",
		defaultProps: {
			leftTitle: "Left column",
			leftContent: "Add supporting information here.",
			rightTitle: "Right column",
			rightContent: "Add supporting information here.",
			stackOnMobile: true
		}
	}
];

